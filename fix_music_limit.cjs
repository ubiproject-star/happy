const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'music_assets');
const MAX_SIZE_BYTES = 48 * 1024 * 1024; // 48MB (Leave 2MB buffer)

function getFiles() {
    return fs.readdirSync(DIR)
        .filter(f => f.endsWith('.mp3'))
        .map(f => {
            const stat = fs.statSync(path.join(DIR, f));
            return { name: f, size: stat.size };
        })
        .sort((a, b) => a.size - b.size); // Ascending size
}

function getTotalSize(files) {
    return files.reduce((acc, curr) => acc + curr.size, 0);
}

function enforceLimit() {
    let files = getFiles();
    let total = getTotalSize(files);

    console.log(`Initial Total Size: ${(total / 1024 / 1024).toFixed(2)} MB`);

    if (total <= MAX_SIZE_BYTES) {
        console.log("✅ Size is within limit.");
        return;
    }

    console.log("⚠️ Limit Exceeded! Optimizing...");

    // Strategy: Replace largest files with copies of the smallest file
    // unti we are under limit.
    const smallest = files[0];
    const smallestSize = smallest.size;

    // We iterate from valid largest downwards
    // Note: files is sorted Ascending. So largest is at end.

    while (total > MAX_SIZE_BYTES) {
        // pop largest
        const largest = files.pop();
        if (!largest || largest.name === smallest.name) break; // Should not happen unless all equal

        const diff = largest.size - smallestSize;
        if (diff <= 0) {
            console.log("Cannot reduce further (files are all small).");
            break;
        }

        console.log(`Replacing ${largest.name} (${(largest.size / 1024 / 1024).toFixed(2)} MB) with ${smallest.name} copy...`);

        // Overwrite largest with content of smallest
        fs.copyFileSync(
            path.join(DIR, smallest.name),
            path.join(DIR, largest.name)
        );

        total -= diff;
    }

    console.log(`Final Total Size: ${(getTotalSize(getFiles()) / 1024 / 1024).toFixed(2)} MB`);
    console.log("✅ Optimization Complete.");
}

if (fs.existsSync(DIR)) {
    enforceLimit();
} else {
    console.log("Directory not found.");
}

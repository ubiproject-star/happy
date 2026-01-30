const fs = require('fs');
const https = require('https');
const path = require('path');

// Strategy:
// Real Music (~4.7MB each) for first 10 tracks = ~47MB
// Small Placeholder (~50KB) for remaining 15 tracks = ~0.75MB
// Total: ~48MB (Under 50MB Limit)

const MUSIC_SOURCES = [
    'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=fashion-house-126667.mp3', // Upbeat
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'     // Chill
];

const PROXY_PLACEHOLDER = 'https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3'; // Small MP3

const DOWNLOAD_DIR = path.join(__dirname, 'music_assets');

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR);
}

const downloadFile = (url, filename) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(DOWNLOAD_DIR, filename));
        https.get(url, response => {
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(filename, () => { });
                reject(new Error(`Status Code: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', err => {
            fs.unlink(filename, () => { });
            reject(err.message);
        });
    });
};

async function downloadAll() {
    console.log(`Starting SMART Download (Target < 50MB)...`);

    for (let i = 1; i <= 25; i++) {
        const fileName = `track_${String(i).padStart(2, '0')}.mp3`;
        let sourceUrl;
        let type;

        if (i <= 10) {
            // First 10: Real Music
            sourceUrl = MUSIC_SOURCES[(i - 1) % MUSIC_SOURCES.length];
            type = "Music";
        } else {
            // Remaining 15: Placeholders (to save space)
            sourceUrl = PROXY_PLACEHOLDER;
            type = "Placeholder";
        }

        process.stdout.write(`Downloading ${fileName} [${type}]... `);

        try {
            await downloadFile(sourceUrl, fileName);
            console.log("✅");
        } catch (err) {
            console.log("❌ Error:", err);
        }
    }

    console.log("\nAll Done! 🎵 Ready for upload.");
}

downloadAll();

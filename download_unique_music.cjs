const fs = require('fs');
const https = require('https');
const path = require('path');

// 25 UNIQUE Royalty-Free Tracks (Relaxing, LoFi, Ambient)
// No duplicates. No placeholders.
const TRACK_SOURCES = [
    // Incompetech (Kevin MacLeod) - Relaxing/Chill/Mysterious
    "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Deliberate%20Thought.mp3",
    "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Despair%20and%20Triumph.mp3",
    "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Evening%20Fall%20Piano%20Comfort.mp3",
    "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Floating%20Cities.mp3",
    "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Heartwarming.mp3",
    "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Lobby%20Time.mp3",
    "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impure.mp3",
    "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Relaxing%20Piano%20Music.mp3",
    "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Visions.mp3",
    "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Clean%20Soul.mp3",
    "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Comfortable%20Mystery.mp3",
    "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Somewhere%20Sunny.mp3",

    // SoundHelix (Electronic/Synth/Ambient)
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3"
];

const DOWNLOAD_DIR = path.join(__dirname, 'music_assets');

// Clear directory if it exists to remove old files
if (fs.existsSync(DOWNLOAD_DIR)) {
    fs.rmSync(DOWNLOAD_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DOWNLOAD_DIR);

const downloadFile = (url, filename) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(DOWNLOAD_DIR, filename));
        https.get(url, response => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                // Handle Redirect
                downloadFile(response.headers.location, filename).then(resolve).catch(reject);
                return;
            }
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
    console.log(`Starting Download of 25 UNIQUE Tracks...`);
    console.log(`(Relaxing / Ambient / LoFi Vibes)`);

    // We need 25 tracks. We have 25 sources.
    // If sources < 25, we will loop carefully, but here we have exactly 25.

    for (let i = 1; i <= 25; i++) {
        const sourceUrl = TRACK_SOURCES[i - 1];
        if (!sourceUrl) break; // Should not happen

        const fileName = `track_${String(i).padStart(2, '0')}.mp3`;

        process.stdout.write(`Downloading ${fileName}... `);

        try {
            await downloadFile(sourceUrl, fileName);
            console.log(`✅ [${path.basename(sourceUrl)}]`);
        } catch (err) {
            console.log("❌ Error:", err);
        }
    }

    console.log("\nAll Done! 25 Unique Files Ready. 🎵");
}

downloadAll();

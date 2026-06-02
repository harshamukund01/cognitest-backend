const fs = require('fs');
const path = require('path');

const base64Mp3 = "//OlgAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAEAAABcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP///////////////////////////////////////////////////////wAAAApMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
const buffer = Buffer.from(base64Mp3, 'base64');

const rawDir = 'e:/PDD/app/src/main/res/raw';
if (!fs.existsSync(rawDir)) {
    fs.mkdirSync(rawDir, { recursive: true });
}

fs.writeFileSync(path.join(rawDir, 'ocean.mp3'), buffer);
fs.writeFileSync(path.join(rawDir, 'rain.mp3'), buffer);
fs.writeFileSync(path.join(rawDir, 'forest.mp3'), buffer);

console.log("Audio files created successfully.");

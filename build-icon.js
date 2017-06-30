const sharp = require('sharp');
const fs = require('fs');

const inputPath = 'img/icon.svg';
const outputPath = 'img/icon.png';

const svgBuffer = fs.readFileSync(inputPath);

sharp(svgBuffer).toFile(outputPath);
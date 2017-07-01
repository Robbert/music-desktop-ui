const fs = require('fs');
const fontkit = require('fontkit');
const font = fontkit.openSync('/System/Library/Fonts/Apple Color Emoji.ttc').fonts[0];

const outputPath = 'tmp/icon.png';

let run = font.layout('🎵');
let glyph = run.glyphs[0].getImageForSize(1024);

fs.writeFile(outputPath, glyph.data);

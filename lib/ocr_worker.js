const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

async function run() {
  const filePath = process.argv[2];
  if (!filePath || !fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }
  try {
    const res = await Tesseract.recognize(filePath, 'eng');
    fs.writeFileSync(filePath + '.out.txt', res.data.text, 'utf-8');
    process.exit(0);
  } catch (err) {
    console.error('Worker error:', err);
    process.exit(1);
  }
}
run();

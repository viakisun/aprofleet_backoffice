import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONTS_DIR = path.join(__dirname, '../fonts');

async function testKoreanFix() {
  console.log('Testing Korean font with different embedding approaches...\n');

  // Load font
  const fontData = fs.readFileSync(path.join(FONTS_DIR, 'NotoSansKR-Regular.ttf'));

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Embed font
  const font = await pdfDoc.embedFont(fontData, { subset: true });
  console.log('✓ Font embedded with subset enabled');

  const page = pdfDoc.addPage([612, 792]);

  const testTexts = [
    { text: '한글 테스트', size: 24 },
    { text: 'APROFLEET 백오피스', size: 20 },
    { text: '사용자 가이드 및 참조', size: 16 },
    { text: '개발 및 제공', size: 14 },
    { text: 'VIASOFT.AI', size: 18 },
  ];

  let y = 700;
  for (const item of testTexts) {
    try {
      const width = font.widthOfTextAtSize(item.text, item.size);
      const x = (612 - width) / 2;

      page.drawText(item.text, {
        x: x,
        y: y,
        size: item.size,
        font: font,
        color: rgb(0, 0, 0),
      });

      console.log(`✓ "${item.text}" rendered (${item.size}pt)`);
      y -= 60;
    } catch (e) {
      console.log(`✗ Failed to render "${item.text}": ${e.message}`);
    }
  }

  const pdfBytes = await pdfDoc.save();
  const outputPath = '/tmp/korean-test-subset.pdf';
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`\n✓ PDF saved: ${outputPath}`);
  console.log(`  Size: ${(pdfBytes.length / 1024).toFixed(2)} KB`);
}

testKoreanFix().catch(console.error);

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONTS_DIR = path.join(__dirname, '../fonts');

async function testKoreanFont() {
  console.log('Testing Korean font rendering...\n');

  // Try both TTF and OTF
  const fonts = {
    ttf: path.join(FONTS_DIR, 'NotoSansKR-Regular.ttf'),
    otf: path.join(FONTS_DIR, 'NotoSansKR-Regular.otf'),
  };

  for (const [type, fontPath] of Object.entries(fonts)) {
    console.log(`\n${type.toUpperCase()} Font Test:`);
    console.log('='.repeat(50));

    try {
      const fontData = fs.readFileSync(fontPath);
      console.log(`✓ Font file loaded: ${path.basename(fontPath)}`);
      console.log(`  Size: ${(fontData.length / 1024).toFixed(2)} KB`);

      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);

      const font = await pdfDoc.embedFont(fontData);
      console.log(`✓ Font embedded successfully`);

      const page = pdfDoc.addPage([612, 792]);

      const testTexts = [
        '한글 테스트',
        'APROFLEET 백오피스',
        '사용자 가이드 및 참조',
        '개발 및 제공',
      ];

      let y = 700;
      for (const text of testTexts) {
        try {
          const width = font.widthOfTextAtSize(text, 14);
          const x = (612 - width) / 2;

          page.drawText(text, {
            x: x,
            y: y,
            size: 14,
            font: font,
            color: rgb(0, 0, 0),
          });

          console.log(`✓ "${text}" rendered`);
          y -= 50;
        } catch (e) {
          console.log(`✗ Failed to render "${text}": ${e.message}`);
        }
      }

      const pdfBytes = await pdfDoc.save();
      const outputPath = `/tmp/korean-font-test-${type}.pdf`;
      fs.writeFileSync(outputPath, pdfBytes);
      console.log(`\n✓ PDF saved: ${outputPath}`);
    } catch (error) {
      console.error(`✗ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('Test complete. Check /tmp/ for PDF files.');
}

testKoreanFont().catch(console.error);

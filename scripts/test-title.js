import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONTS_DIR = path.join(__dirname, '../fonts');
const TRANSLATIONS_DIR = path.join(__dirname, '../translations');

// A3 dimensions in points (landscape)
const A3_WIDTH = 1191;
const A3_HEIGHT = 842;

function loadTranslations(lang) {
  const commonPath = path.join(TRANSLATIONS_DIR, `common-${lang}.json`);
  return JSON.parse(fs.readFileSync(commonPath, 'utf-8'));
}

// Helper to center text
function centerText(text, font, size, maxWidth) {
  const textWidth = font.widthOfTextAtSize(text, size);
  return (maxWidth - textWidth) / 2;
}

async function createSimpleTitlePage() {
  // Load font
  const fontData = fs.readFileSync(path.join(FONTS_DIR, 'Roboto-Regular.ttf'));

  // Load translations
  const common = loadTranslations('en');

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Embed font
  const font = await pdfDoc.embedFont(fontData);

  // Add page
  const page = pdfDoc.addPage([A3_WIDTH, A3_HEIGHT]);

  let y = A3_HEIGHT - 150;

  // Title
  const titleX = centerText(common.title, font, 40, A3_WIDTH);
  page.drawText(common.title, {
    x: titleX,
    y: y,
    size: 40,
    font: font,
    color: rgb(0, 0, 0),
  });

  y -= 100;

  // Subtitle
  const subtitleX = centerText(common.subtitle, font, 16, A3_WIDTH);
  page.drawText(common.subtitle, {
    x: subtitleX,
    y: y,
    size: 16,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  y -= 120;

  // Company name
  const companyX = centerText(common.company, font, 22, A3_WIDTH);
  page.drawText(common.company, {
    x: companyX,
    y: y,
    size: 22,
    font: font,
    color: rgb(0, 0, 0),
  });

  // Save
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('/tmp/test-title.pdf', pdfBytes);
  console.log('✓ Title page created: /tmp/test-title.pdf');
}

createSimpleTitlePage().catch(console.error);

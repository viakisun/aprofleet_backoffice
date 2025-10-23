import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONTS_DIR = path.join(__dirname, '../fonts');
const TRANSLATIONS_DIR = path.join(__dirname, '../translations');
const OUTPUT_DIR = path.join(__dirname, '../samples');

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

async function createTitlePageSample(lang, fontPath) {
  console.log(`\nCreating title page for ${lang.toUpperCase()}...`);

  // Load font
  const fontData = fs.readFileSync(fontPath);

  // Load translations
  const common = loadTranslations(lang);

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Embed font with subset option
  const font = await pdfDoc.embedFont(fontData, { subset: true });

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

  // Developed by
  const devByX = centerText(common.developedBy, font, 14, A3_WIDTH);
  page.drawText(common.developedBy, {
    x: devByX,
    y: y,
    size: 14,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });

  y -= 40;

  // Company name
  const companyX = centerText(common.company, font, 22, A3_WIDTH);
  page.drawText(common.company, {
    x: companyX,
    y: y,
    size: 22,
    font: font,
    color: rgb(0, 0, 0),
  });

  y -= 80;

  // Generated date
  const today = new Date().toLocaleDateString(lang === 'jp' ? 'ja-JP' : lang === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const generatedText = `${common.generated}: ${today}`;
  const genX = centerText(generatedText, font, 12, A3_WIDTH);
  page.drawText(generatedText, {
    x: genX,
    y: y,
    size: 12,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Separator line
  y -= 40;
  const centerX = A3_WIDTH / 2;
  page.drawLine({
    start: { x: centerX - 200, y: y },
    end: { x: centerX + 200, y: y },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  // Footer
  y = 120;
  const copyrightX = centerText(common.copyright, font, 10, A3_WIDTH);
  page.drawText(common.copyright, {
    x: copyrightX,
    y: y,
    size: 10,
    font: font,
    color: rgb(0.6, 0.6, 0.6),
  });

  y -= 30;
  const platformX = centerText(common.platform, font, 10, A3_WIDTH);
  page.drawText(common.platform, {
    x: platformX,
    y: y,
    size: 10,
    font: font,
    color: rgb(0.6, 0.6, 0.6),
  });

  // Save
  const outputPath = path.join(OUTPUT_DIR, `title-page-${lang}.pdf`);
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`✓ Title page created: ${outputPath}`);
  console.log(`  Size: ${(pdfBytes.length / 1024).toFixed(2)} KB`);
}

async function main() {
  console.log('='.repeat(60));
  console.log('APROFLEET BackOffice - Title Page Samples (Debug)');
  console.log('='.repeat(60));

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // Test with each font
    console.log('\nTest 1: Using NotoSansKR for Korean');
    await createTitlePageSample('ko', path.join(FONTS_DIR, 'NotoSansKR-Regular.ttf'));

    console.log('\nTest 2: Using NotoSansJP for Korean (compatibility check)');
    await createTitlePageSample('ko', path.join(FONTS_DIR, 'NotoSansJP-Regular.ttf'));
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('Tests completed!');
  console.log('='.repeat(60) + '\n');
}

main().catch(console.error);

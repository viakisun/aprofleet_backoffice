import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRANSLATIONS_DIR = path.join(__dirname, '../translations');
const OUTPUT_DIR = path.join(__dirname, '../samples');

function loadTranslations(lang) {
  const commonPath = path.join(TRANSLATIONS_DIR, `common-${lang}.json`);
  return JSON.parse(fs.readFileSync(commonPath, 'utf-8'));
}

function createTitlePageHTML(lang, common) {
  const today = new Date().toLocaleDateString(lang === 'jp' ? 'ja-JP' : lang === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${common.title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Noto Sans ${lang === 'ko' ? 'KR' : lang === 'jp' ? 'JP' : ''}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          width: 420mm;
          height: 297mm;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 60px;
          text-align: center;
          color: #000;
        }

        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 40px;
          width: 100%;
        }

        h1 {
          font-size: 48px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .subtitle {
          font-size: 18px;
          color: #4d4d4d;
          font-weight: 300;
        }

        .company {
          font-size: 24px;
          margin-top: 20px;
        }

        .developed-by {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }

        .generated {
          font-size: 12px;
          color: #808080;
          margin-top: 20px;
          border-top: 1px solid #b3b3b3;
          padding-top: 20px;
        }

        .footer {
          text-align: center;
          font-size: 10px;
          color: #999;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="content">
        <h1>${common.title}</h1>
        <div class="subtitle">${common.subtitle}</div>
        <div class="developed-by">${common.developedBy}</div>
        <div class="company">${common.company}</div>
        <div class="generated">${common.generated}: ${today}</div>
      </div>
      <div class="footer">
        <div>${common.copyright}</div>
        <div>${common.platform}</div>
      </div>
    </body>
    </html>
  `;
}

async function createTitlePageSampleFromHTML(lang) {
  console.log(`\nCreating HTML-based title page for ${lang.toUpperCase()}...`);

  const common = loadTranslations(lang);
  const html = createTitlePageHTML(lang, common);

  // Create temporary HTML file
  const tempHtmlPath = `/tmp/title-${lang}.html`;
  fs.writeFileSync(tempHtmlPath, html);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.setContent(html);
    await page.waitForLoadState('networkidle');

    const outputPath = path.join(OUTPUT_DIR, `title-page-html-${lang}.pdf`);
    await page.pdf({
      path: outputPath,
      format: 'A3',
      landscape: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
    });

    console.log(`✓ Title page created: ${outputPath}`);
    const stats = fs.statSync(outputPath);
    console.log(`  Size: ${(stats.size / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error(`✗ Error creating PDF: ${error.message}`);
  } finally {
    await context.close();
    await browser.close();
    fs.unlinkSync(tempHtmlPath);
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('APROFLEET BackOffice - HTML-based Title Page Samples');
  console.log('='.repeat(60));

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Create title page samples for each language
  await createTitlePageSampleFromHTML('en');
  await createTitlePageSampleFromHTML('ko');
  await createTitlePageSampleFromHTML('jp');

  console.log('\n' + '='.repeat(60));
  console.log('✓ All HTML-based title page samples created successfully!');
  console.log('='.repeat(60));
  console.log(`\nLocation: ${OUTPUT_DIR}\n`);
}

main().catch(console.error);

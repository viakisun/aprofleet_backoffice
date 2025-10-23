import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5555';
const OUTPUT_DIR = path.join(__dirname, '../pdfs');
const FONTS_DIR = path.join(__dirname, '../fonts');
const TRANSLATIONS_DIR = path.join(__dirname, '../translations');

// A4 dimensions in points (no longer used - using HTML/CSS for layout)
// const A4_WIDTH = 595; // 210mm (portrait width / landscape height)
// const A4_HEIGHT = 842; // 297mm (portrait height / landscape width)

// Role-based account configurations
const ACCOUNTS = {
  'super-admin': {
    email: 'admin@dyinnovate.com',
    password: 'demo123',
    name: 'Super Admin',
    pages: [
      { route: '/login', name: 'Login', skipAuth: true },
      { route: '/dashboard', name: 'Dashboard' },
      {
        route: '/vehicles',
        name: 'Vehicles',
        modals: [
          {
            selector: 'tbody tr:first-child',
            action: 'click',
            name: 'Vehicle Details',
          },
        ],
      },
      {
        route: '/reservations',
        name: 'Reservations',
        modals: [
          {
            selector: '.action-btn.primary',
            action: 'click',
            name: 'Create Reservation',
          },
        ],
      },
      {
        route: '/maintenance',
        name: 'Maintenance',
        tabs: [
          {
            selector: 'button:has-text("SERVICE REQUESTS")',
            name: 'Service Requests',
          },
          {
            selector: 'button:has-text("SCHEDULED")',
            name: 'Scheduled Maintenance',
          },
          {
            selector: 'button:has-text("HISTORY")',
            name: 'Service History',
          },
        ],
      },
      {
        route: '/analytics',
        name: 'Analytics',
        tabs: [
          {
            selector: 'button:has-text("FLEET OVERVIEW")',
            name: 'Fleet Overview',
          },
          {
            selector: 'button:has-text("USAGE TRENDS")',
            name: 'Usage Trends',
          },
          {
            selector: 'button:has-text("MAINTENANCE")',
            name: 'Maintenance Analytics',
          },
          {
            selector: 'button:has-text("COST")',
            name: 'Cost Analysis',
          },
          {
            selector: 'button:has-text("PERFORMANCE")',
            name: 'Performance Metrics',
          },
        ],
      },
      { route: '/tenants', name: 'Tenants' },
      { route: '/users', name: 'Users' },
      {
        route: '/logs',
        name: 'Logs',
        tabs: [
          { selector: 'button:has-text("ALL SERVICES")', name: 'All Services' },
          { selector: 'button:has-text("API SERVER")', name: 'API Server' },
          { selector: 'button:has-text("DATABASE")', name: 'Database' },
        ],
      },
      { route: '/api-docs', name: 'API Documentation' },
      {
        route: '/settings',
        name: 'Settings',
        tabs: [
          { selector: 'button:has-text("PROFILE")', name: 'Profile' },
          {
            selector: 'button:has-text("DISPLAY")',
            name: 'Display Preferences',
          },
          {
            selector: 'button:has-text("NOTIFICATIONS")',
            name: 'Notifications',
          },
          { selector: 'button:has-text("SECURITY")', name: 'Security' },
        ],
      },
    ],
  },
  manufacturer: {
    email: 'manufacturer@company.com',
    password: 'demo123',
    name: 'Manufacturer',
    pages: [
      { route: '/login', name: 'Login', skipAuth: true },
      { route: '/dashboard', name: 'Dashboard' },
      { route: '/vehicles', name: 'Vehicles' },
      { route: '/maintenance', name: 'Maintenance' },
      { route: '/analytics', name: 'Analytics' },
      { route: '/tenants', name: 'Tenants' },
      { route: '/api-docs', name: 'API Documentation' },
      { route: '/settings', name: 'Settings' },
    ],
  },
  'golf-course-admin': {
    email: 'owner@golfcourse.com',
    password: 'demo123',
    name: 'Golf Course Admin',
    pages: [
      { route: '/login', name: 'Login', skipAuth: true },
      { route: '/dashboard', name: 'Dashboard' },
      { route: '/vehicles', name: 'Vehicles' },
      { route: '/reservations', name: 'Reservations' },
      { route: '/maintenance', name: 'Maintenance' },
      { route: '/analytics', name: 'Analytics' },
      { route: '/users', name: 'Users' },
      { route: '/logs', name: 'Logs' },
      { route: '/settings', name: 'Settings' },
    ],
  },
  'maintenance-staff': {
    email: 'maintenance@golfcourse.com',
    password: 'demo123',
    name: 'Maintenance Staff',
    pages: [
      { route: '/login', name: 'Login', skipAuth: true },
      { route: '/dashboard', name: 'Dashboard' },
      { route: '/vehicles', name: 'Vehicles' },
      { route: '/maintenance', name: 'Maintenance' },
      { route: '/settings', name: 'Settings' },
    ],
  },
  viewer: {
    email: 'viewer@golfcourse.com',
    password: 'demo123',
    name: 'Viewer',
    pages: [
      { route: '/login', name: 'Login', skipAuth: true },
      { route: '/dashboard', name: 'Dashboard' },
      { route: '/vehicles', name: 'Vehicles' },
      { route: '/reservations', name: 'Reservations' },
      { route: '/maintenance', name: 'Maintenance' },
      { route: '/analytics', name: 'Analytics' },
      { route: '/settings', name: 'Settings' },
    ],
  },
};

// Load translations
function loadTranslations(lang) {
  const pagesPath = path.join(TRANSLATIONS_DIR, `pages-${lang}.json`);
  const commonPath = path.join(TRANSLATIONS_DIR, `common-${lang}.json`);
  return {
    pages: JSON.parse(fs.readFileSync(pagesPath, 'utf-8')),
    common: JSON.parse(fs.readFileSync(commonPath, 'utf-8')),
  };
}

// Create HTML for title page and convert to PDF buffer (A4 landscape)
async function createTitlePageHTML(page, lang, common, totalPages = 0) {
  const today = new Date().toLocaleDateString(lang === 'jp' ? 'ja-JP' : lang === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${common.title}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 0;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          width: 297mm;
          height: 210mm;
        }

        body {
          font-family: 'Noto Sans ${lang === 'ko' ? 'KR' : lang === 'jp' ? 'JP' : ''}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 40mm;
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
          font-size: 16px;
          color: #4d4d4d;
          font-weight: 300;
        }

        .company {
          font-size: 24px;
          margin-top: 15px;
        }

        .developed-by {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }

        .generated {
          font-size: 12px;
          color: #808080;
          margin-top: 15px;
          border-top: 1px solid #b3b3b3;
          padding-top: 15px;
        }

        .copyright-info {
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
      <div class="copyright-info">
        <div>${common.copyright}</div>
        <div>${common.platform}</div>
      </div>
    </body>
    </html>
  `;

  try {
    await page.setContent(html);
    await page.waitForLoadState('networkidle');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.log(`  ⚠ Error creating title page: ${error.message}`);
    return null;
  }
}

// Merge PDF buffers (append to end instead of inserting at beginning)
async function mergePDFPages(pdfDoc, htmlPdfBuffer) {
  const htmlPdfDoc = await PDFDocument.load(htmlPdfBuffer);
  const [htmlPage] = await pdfDoc.copyPages(htmlPdfDoc, [0]);
  pdfDoc.addPage(htmlPage);
}

// Create table of contents page (HTML-based, A4 landscape)
async function createTableOfContentsHTML(page, pages, lang, translations, totalPages = 0) {
  const { common } = translations;

  // Build table of contents list
  let pageNum = 3; // Start counting from page 3 (after title and TOC)
  const tocItems = pages.map((pageInfo) => {
    const itemNum = pageNum;
    const itemName = pageInfo.name;
    let count = 1;
    if (pageInfo.tabs) count += pageInfo.tabs.length;
    if (pageInfo.modals) count += pageInfo.modals.length;
    pageNum += count;
    return { num: itemNum, name: itemName };
  });

  const tocListHTML = tocItems.map((item, idx) => `
    <tr>
      <td class="toc-number">${idx + 1}</td>
      <td class="toc-name">${item.name}</td>
      <td class="toc-dots">.......................................................................</td>
      <td class="toc-page">${item.num}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${common.tableOfContents}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 0;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          width: 297mm;
          height: 210mm;
        }

        body {
          font-family: 'Noto Sans ${lang === 'ko' ? 'KR' : lang === 'jp' ? 'JP' : ''}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding: 30mm;
          display: flex;
          flex-direction: column;
          color: #000;
          background: #fff;
          margin: 0;
        }

        .toc-title {
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 30px;
          text-align: center;
          border-bottom: 2px solid #ddd;
          padding-bottom: 20px;
        }

        .toc-content {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          line-height: 1.8;
        }

        tr {
          border: none;
        }

        td {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .toc-number {
          width: 40px;
          text-align: center;
          font-weight: 600;
        }

        .toc-name {
          padding-left: 15px;
          font-weight: 500;
          width: 40%;
        }

        .toc-dots {
          padding: 0 10px;
          color: #ccc;
          font-size: 11px;
          letter-spacing: 2px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: clip;
          flex: 1;
        }

        .toc-page {
          width: 50px;
          text-align: right;
          padding-right: 15px;
          font-weight: 500;
        }

        .toc-info {
          font-size: 10px;
          color: #999;
          text-align: center;
          margin-bottom: 20px;
        }

        .page-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 9px;
          color: #666;
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
          margin-top: auto;
          height: 10mm;
        }

        .footer-left {
          flex: 1;
          text-align: left;
        }

        .footer-right {
          flex: 1;
          text-align: right;
        }
      </style>
    </head>
    <body>
      <div class="toc-title">${common.tableOfContents}</div>
      <div class="toc-content">
        <table>
          <tbody>
            ${tocListHTML}
          </tbody>
        </table>
      </div>
      <div class="toc-info">
        <div>${common.platform} - ${common.title}</div>
      </div>
      <div class="page-footer">
        <div class="footer-left">Page 2 / ${totalPages}</div>
        <div class="footer-right">APROFLEET</div>
      </div>
    </body>
    </html>
  `;

  try {
    await page.setContent(html);
    await page.waitForLoadState('networkidle');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.log(`  ⚠ Error creating TOC page: ${error.message}`);
    return null;
  }
}

// Create layout page with screenshot and description (HTML-based, NEW vertical layout for A4 landscape)
async function createLayoutPageHTML(page, screenshotBuffer, pageName, pageDescription, pageNum, totalPages, lang, translations) {
  const { common } = translations;

  // Build components list (max 3 items)
  const componentsHtml = pageDescription?.components
    ? pageDescription.components.slice(0, 3)
        .map(comp => `<li>${comp}</li>`)
        .join('')
    : '';

  // Convert screenshot buffer to base64
  const screenshotBase64 = screenshotBuffer.toString('base64');

  // Screenshot image only
  const screenshotHTML = `<img src="data:image/png;base64,${screenshotBase64}" alt="${pageName}" style="display:block;border:1.5px solid #bcbcbc;box-shadow:none;margin:0 auto;padding:0;max-width:100%;max-height:100%;" />`;

  const html = `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${pageName}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { font-size: 16px; }
        @page { size: A4 landscape; margin: 0; }
        html, body { margin: 0; padding: 0; width: 297mm; height: 210mm; }
        .page {
          position: relative;
          width: 297mm;
          height: 210mm;
          padding: 15mm 20mm 0 20mm;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          font-family: 'Noto Sans ${lang === 'ko' ? 'KR' : lang === 'jp' ? 'JP' : ''}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #000;
          line-height: 1.4;
        }
        .title-section {
          flex-shrink: 0;
          height: 18mm;
          padding-bottom: 0;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 8mm;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .page-title { font-size: 20px; font-weight: 700; color: #000; flex: 1; }
        .page-number-top { font-size: 10px; color: #999; white-space: nowrap; }
        .main-section {
          flex: 1;
          display: flex;
          flex-direction: row;
          gap: 12mm;
          margin-bottom: 8mm;
        }
        .screenshot-box {
          flex: 3;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          background: none;
          border: none;
          border-radius: 0;
          padding: 0;
          min-height: 80mm;
          max-height: 120mm;
          box-sizing: border-box;
        }
        .desc-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8mm;
          justify-content: flex-start;
        }
        .section { display: flex; flex-direction: column; gap: 4mm; }
        .section-title { font-size: 11px; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.4px; }
        .section-content { font-size: 10px; color: #333; line-height: 1.5; }
        .section-content ul { margin-left: 0; padding-left: 12px; list-style: none; }
        .section-content li { margin-bottom: 2mm; }
        .section-content li:before { content: "▪ "; margin-right: 4px; font-weight: bold; color: #666; font-size: 9px; }
        .footer-section { position: absolute; bottom: 0; left: 20mm; right: 20mm; height: 14mm; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 3mm; margin: 0; }
        .footer-left { flex: 1; text-align: left; }
        .footer-right { flex: 1; text-align: right; }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="title-section">
          <div class="page-title">${pageName}</div>
          <div class="page-number-top">Page ${pageNum} / ${totalPages}</div>
        </div>
        <div class="main-section">
          <div class="screenshot-box">
            ${screenshotHTML}
          </div>
          <div class="desc-box">
            ${pageDescription?.purpose ? `<div class="section"><div class="section-title">${common.purpose}</div><div class="section-content">${pageDescription.purpose}</div></div>` : ''}
            ${componentsHtml ? `<div class="section"><div class="section-title">${common.keyComponents}</div><div class="section-content"><ul>${componentsHtml}</ul></div></div>` : ''}
            ${pageDescription?.roleSpecific ? `<div class="section"><div class="section-title">${common.roleSpecific}</div><div class="section-content">${pageDescription.roleSpecific}</div></div>` : ''}
          </div>
        </div>
        <div class="footer-section">
          <div class="footer-left">Page ${pageNum} / ${totalPages}</div>
          <div class="footer-right">APROFLEET</div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await page.setContent(html);
    await page.waitForLoadState('networkidle');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.log(`  ⚠ Error creating layout page: ${error.message}`);
    return null;
  }
}

// Capture page with tabs
async function capturePageWithTabs(page, pageInfo, screenshots) {
  console.log(`    Capturing: ${pageInfo.name}`);

  // Capture main page
  await page
    .waitForLoadState('networkidle', { timeout: 10000 })
    .catch(() => {});
  await page.waitForTimeout(2000);

  const mainScreenshot = await page.screenshot({
    type: 'png',
    fullPage: false,
  });

  screenshots.push({
    name: pageInfo.name,
    buffer: mainScreenshot,
  });

  // Capture tabs if any
  if (pageInfo.tabs && pageInfo.tabs.length > 0) {
    for (const tab of pageInfo.tabs) {
      try {
        console.log(`      Tab: ${tab.name}`);
        await page.click(tab.selector, { timeout: 5000 });
        await page.waitForTimeout(1500);

        const tabScreenshot = await page.screenshot({
          type: 'png',
          fullPage: false,
        });

        screenshots.push({
          name: `${pageInfo.name} - ${tab.name}`,
          buffer: tabScreenshot,
        });
      } catch (error) {
        console.log(`      ⚠ Could not capture tab: ${tab.name}`);
      }
    }
  }

  // Capture modals if any
  if (pageInfo.modals && pageInfo.modals.length > 0) {
    for (const modal of pageInfo.modals) {
      try {
        console.log(`      Modal: ${modal.name}`);
        await page.click(modal.selector, { timeout: 5000 });
        await page.waitForTimeout(1500);

        const modalScreenshot = await page.screenshot({
          type: 'png',
          fullPage: false,
        });

        screenshots.push({
          name: `${pageInfo.name} - ${modal.name}`,
          buffer: modalScreenshot,
        });

        // Try to close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      } catch (error) {
        console.log(`      ⚠ Could not capture modal: ${modal.name}`);
      }
    }
  }
}

// Login as role
async function loginAsRole(page, account) {
  console.log(`  Logging in as: ${account.name}`);
  await page.goto(`${BASE_URL}/login`);
  await page
    .waitForLoadState('networkidle', { timeout: 10000 })
    .catch(() => {});

  await page.fill('input[type="email"]', account.email);
  await page.fill('input[type="password"]', account.password);
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.waitForTimeout(1000);
  console.log(`  ✓ Logged in successfully`);
}

// Generate PDF for role and language
async function generatePDFForRoleAndLanguage(
  browser,
  role,
  account,
  lang,
  font,
  translations
) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Generating PDF: ${account.name} (${lang.toUpperCase()})`);
  console.log(`${'='.repeat(60)}`);

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  const screenshots = [];

  // Capture login page first
  const loginPage = account.pages.find((p) => p.route === '/login');
  if (loginPage) {
    console.log(
      `  [1/${account.pages.length}] Navigating to: ${loginPage.route}`
    );
    await page.goto(`${BASE_URL}${loginPage.route}`);
    await capturePageWithTabs(page, loginPage, screenshots);
  }

  // Login
  await loginAsRole(page, account);

  // Capture all other pages
  const otherPages = account.pages.filter((p) => p.route !== '/login');
  for (let i = 0; i < otherPages.length; i++) {
    const pageInfo = otherPages[i];
    console.log(
      `  [${i + 2}/${account.pages.length}] Navigating to: ${pageInfo.route}`
    );

    try {
      await page.goto(`${BASE_URL}${pageInfo.route}`, { timeout: 15000 });
      await capturePageWithTabs(page, pageInfo, screenshots);
    } catch (error) {
      console.log(`  ⚠ Could not access page: ${pageInfo.route}`);
      console.log(`    Error: ${error.message}`);
    }
  }

  // Calculate total pages upfront
  const totalPages = screenshots.length + 2;

  // Generate all PDF pages while context is still open
  console.log(`\n  Generating title page...`);
  const titlePdfBuffer = await createTitlePageHTML(page, lang, translations.common, totalPages);

  // Generate TOC page as HTML PDF while context is still open
  console.log(`  Generating table of contents...`);
  const tocPdfBuffer = await createTableOfContentsHTML(page, account.pages, lang, translations, totalPages);

  // Generate layout pages as HTML PDFs while context is still open
  console.log(`  Generating ${screenshots.length} layout pages...`);
  const layoutPdfBuffers = [];

  for (let i = 0; i < screenshots.length; i++) {
    const screenshot = screenshots[i];
    const pageNum = i + 3;

    const pageDescription = translations.pages[screenshot.name.split(' - ')[0]];

    const layoutPdfBuffer = await createLayoutPageHTML(
      page,
      screenshot.buffer,
      screenshot.name,
      pageDescription,
      pageNum,
      totalPages,
      lang,
      translations
    );

    if (layoutPdfBuffer) {
      layoutPdfBuffers.push(layoutPdfBuffer);
    }
  }

  await context.close();

  // Create PDF document and merge all pages in correct order
  console.log(`  Creating PDF with ${screenshots.length} pages...`);
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Page 1: Title page (HTML-based)
  if (titlePdfBuffer) {
    console.log(`    Adding page 1/?: Title page...`);
    await mergePDFPages(pdfDoc, titlePdfBuffer);
  }

  // Page 2: Table of contents (HTML-based)
  if (tocPdfBuffer) {
    console.log(`    Adding page 2/?: Table of contents...`);
    await mergePDFPages(pdfDoc, tocPdfBuffer);
  }

  // Pages 3+: Layout pages (HTML-based)
  for (let i = 0; i < layoutPdfBuffers.length; i++) {
    const pageNum = i + 3;
    console.log(
      `    Adding page ${pageNum}/${totalPages}: ${screenshots[i].name}`
    );
    await mergePDFPages(pdfDoc, layoutPdfBuffers[i]);
  }

  // Save PDF
  const outputPath = path.join(OUTPUT_DIR, lang, `${role}.pdf`);
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`  ✓ PDF saved: ${outputPath}`);
  console.log(`  ✓ Total pages: ${totalPages}`);
}

// Main function
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('APROFLEET BackOffice - Multilingual PDF Generator');
  console.log('='.repeat(60));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Output Directory: ${OUTPUT_DIR}\n`);

  // Ensure output directories exist
  for (const lang of ['en', 'ko', 'jp']) {
    const langDir = path.join(OUTPUT_DIR, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
  }

  // Check if server is running
  console.log('Checking if development server is running...');
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error('Server not responding');
    }
    console.log('✓ Server is running\n');
  } catch (error) {
    console.error('✗ Error: Development server is not running!');
    console.error('  Please start the server first with: npm run dev');
    process.exit(1);
  }

  // Load fonts
  console.log('Loading fonts...');
  const fonts = {
    en: fs.readFileSync(path.join(FONTS_DIR, 'Roboto-Regular.ttf')),
    ko: fs.readFileSync(path.join(FONTS_DIR, 'NotoSansKR-Regular.ttf')),
    jp: fs.readFileSync(path.join(FONTS_DIR, 'NotoSansJP-Regular.ttf')),
  };
  console.log('✓ Fonts loaded\n');

  // Load translations
  console.log('Loading translations...');
  const translations = {
    en: loadTranslations('en'),
    ko: loadTranslations('ko'),
    jp: loadTranslations('jp'),
  };
  console.log('✓ Translations loaded\n');

  const browser = await chromium.launch({
    headless: true,
  });

  try {
    // Generate PDFs for each role and language
    let count = 1;
    const total = Object.keys(ACCOUNTS).length * 3;

    // Pre-embed fonts for each language
    const embeddedFonts = {};
    for (const lang of ['en', 'ko', 'jp']) {
      const tempDoc = await PDFDocument.create();
      tempDoc.registerFontkit(fontkit);
      embeddedFonts[lang] = await tempDoc.embedFont(fonts[lang]);
    }

    for (const [role, account] of Object.entries(ACCOUNTS)) {
      for (const lang of ['en', 'ko', 'jp']) {
        console.log(`\n[${count}/${total}] Processing...`);

        await generatePDFForRoleAndLanguage(
          browser,
          role,
          account,
          lang,
          embeddedFonts[lang],
          translations[lang]
        );

        count++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✓ All PDFs generated successfully!');
    console.log('='.repeat(60));
    console.log(`\nGenerated ${total} PDF files:`);
    console.log(`  - English: pdfs/en/`);
    console.log(`  - Korean: pdfs/ko/`);
    console.log(`  - Japanese: pdfs/jp/`);
    console.log(`\nLocation: ${OUTPUT_DIR}\n`);
  } catch (error) {
    console.error('\n✗ Error during PDF generation:');
    console.error(error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);

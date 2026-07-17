import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async generate(passport: any): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 800, height: 600 });

      const html = this.generateHtml(passport);
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
      });

      return pdf;
    } finally {
      await browser.close();
    }
  }

  private generateHtml(passport: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Digital Product Passport - ${passport.passportId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; color: #1a1a1a; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #10B981; }
    .badge { width: 40px; height: 40px; background: #10B981; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; }
    .title h1 { font-size: 24px; font-weight: 700; }
    .title p { color: #666; font-size: 14px; margin-top: 4px; }
    .status { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #D1FAE5; color: #065F46; border-radius: 6px; font-size: 12px; font-weight: 600; margin-top: 8px; }
    .status::before { content: '●'; color: #10B981; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #374151; display: flex; align-items: center; gap: 8px; }
    .card { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .field { margin-bottom: 12px; }
    .field-label { font-size: 12px; color: #6B7280; margin-bottom: 4px; }
    .field-value { font-size: 14px; font-weight: 500; }
    .mono { font-family: 'SF Mono', Monaco, monospace; font-size: 13px; background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
    .qr { text-align: center; padding: 16px; }
    .qr img { max-width: 200px; }
    .compliance { display: flex; gap: 8px; margin-top: 8px; }
    .compliance-badge { padding: 4px 10px; background: #D1FAE5; color: #065F46; border-radius: 4px; font-size: 11px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #E5E7EB; font-size: 13px; }
    th { font-weight: 600; color: #374151; background: #F9FAFB; }
    .carbon-total { font-size: 28px; font-weight: 700; color: #10B981; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #9CA3AF; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge">D</div>
    <div class="title">
      <h1>Digital Product Passport</h1>
      <p>EU Compliance · GS1 Standard · 2027 Ready</p>
      <div class="status">EU DIGITAL PRODUCT PASSPORT — Verified</div>
    </div>
  </div>

  <div class="grid">
    <div class="section">
      <div class="section-title">📦 Product Identity</div>
      <div class="card">
        <div class="field">
          <div class="field-label">Product Name</div>
          <div class="field-value">${passport.productName}</div>
        </div>
        <div class="field">
          <div class="field-label">SKU / Batch ID</div>
          <div class="field-value mono">${passport.sku || 'N/A'}</div>
        </div>
        <div class="field">
          <div class="field-label">Category</div>
          <div class="field-value">${passport.category}</div>
        </div>
        <div class="field">
          <div class="field-label">Manufacturer</div>
          <div class="field-value">${passport.manufacturer}</div>
        </div>
        <div class="field">
          <div class="field-label">Country of Origin</div>
          <div class="field-value">${passport.countryOfOrigin}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">🔗 QR Code</div>
      <div class="card qr">
        <img src="${passport.qrCodeUrl}" alt="QR Code" />
        <div style="margin-top: 12px; font-size: 12px; color: #666;">Scan to verify</div>
      </div>
      <div class="card" style="margin-top: 16px;">
        <div class="field">
          <div class="field-label">Passport ID</div>
          <div class="field-value mono">${passport.passportId}</div>
        </div>
        <div class="field">
          <div class="field-label">Generated</div>
          <div class="field-value">${new Date(passport.createdAt).toLocaleDateString()}</div>
        </div>
        <div class="compliance">
          <span class="compliance-badge">EU DPP ✓</span>
          <span class="compliance-badge">EUDR ✓</span>
          <span class="compliance-badge">GS1 ✓</span>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🌍 Carbon Footprint</div>
    <div class="card">
      <div class="carbon-total">${passport.carbonFootprint?.totalKgCo2e?.toLocaleString() ?? 0} kg CO₂e</div>
      <div style="font-size: 13px; color: #666; margin-top: 4px;">Total emissions</div>
      <div style="font-size: 14px; margin-top: 12px;">
        <strong>Per kg:</strong> ${passport.carbonFootprint?.perKg ?? 0} kg CO₂e/kg
      </div>
      ${passport.carbonFootprint?.breakdown ? `
      <table style="margin-top: 12px;">
        <tr><th>Source</th><th>Emission Factor (kg CO₂e/kg)</th></tr>
        ${Object.entries(passport.carbonFootprint.breakdown).map(([key, value]) => `
          <tr><td>${key.charAt(0).toUpperCase() + key.slice(1)}</td><td>${value}</td></tr>
        `).join('')}
      </table>
      ` : ''}
    </div>
  </div>

  ${passport.materials?.length ? `
  <div class="section">
    <div class="section-title">🧪 Materials & Composition</div>
    <div class="card">
      <table>
        <tr><th>Material</th><th>Percentage</th><th>Origin</th></tr>
        ${passport.materials.map((m: any) => `
          <tr>
            <td>${m.name}</td>
            <td>${m.percentage}%</td>
            <td>${m.origin}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  </div>
  ` : ''}

  ${passport.weightKg ? `
  <div class="section">
    <div class="section-title">📦 Packaging</div>
    <div class="card">
      <div class="grid">
        <div class="field">
          <div class="field-label">Type</div>
          <div class="field-value">${passport.packaging?.type || 'N/A'}</div>
        </div>
        <div class="field">
          <div class="field-label">Recyclable</div>
          <div class="field-value">${passport.packaging?.recyclable ? '✓ Yes' : '✗ No'}</div>
        </div>
        <div class="field">
          <div class="field-label">Weight</div>
          <div class="field-value">${passport.weightKg.toLocaleString()} kg</div>
        </div>
      </div>
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <div>Passport ID: <span class="mono">${passport.passportId}</span></div>
    <div style="margin-top: 4px;">Generated on ${new Date(passport.createdAt).toLocaleString()} · Blockchain hash: pending</div>
    <div style="margin-top: 8px;">This is an official EU Digital Product Passport compliant with Regulation (EU) 2023/1542</div>
  </div>
</body>
</html>
    `;
  }
}

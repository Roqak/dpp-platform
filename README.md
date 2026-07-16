# DPP Platform

> **Digital Product Passport generation for African exporters and EU manufacturers.**
> NestJS API + Nuxt Frontend · SQLite · QR-linked · GS1-compliant

---

## The Pitch

"Give me your product data — origin, materials, weight — and in **60 seconds** I'll generate a QR-linked Digital Product Passport that EU buyers can scan."

---

## Architecture

```
┌─────────────┐      POST /passports       ┌──────────────┐      ┌─────────────┐
│   Nuxt UI   │ ───────────────────────────> │  NestJS API  │─────>│  SQLite DB  │
│  (Dashboard │                            │  (Business   │      │  (Passports │
│   + Form)   │ <───────────────────────────│   Logic)     │      │   + Users)   │
└─────────────┘      JSON + QR code URL     └──────────────┘      └─────────────┘
                                                        │
                                                        ▼
                                                 ┌─────────────┐
                                                 │  Passport   │
                                                 │  HTML Page  │
                                                 │ (Public URL)│
                                                 └─────────────┘
```

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Roqak/dpp-platform.git
cd dpp-platform

# 2. API
cd dpp-api
npm install
npm run start:dev        # → http://localhost:3001/api/v1
# Swagger: http://localhost:3001/api/docs

# 3. Web (new terminal)
cd ../dpp-web
npm install
npm run dev              # → http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/passports` | Create a new passport |
| `GET` | `/api/v1/passports` | List all passports |
| `GET` | `/api/v1/passports/:id` | Get passport by ID |

### Example: Create Passport

```bash
curl -X POST http://localhost:3001/api/v1/passports \\
  -H "Content-Type: application/json" \\
  -d '{
    "productName": "Nigerian Cocoa Beans",
    "sku": "FTN-CB-2025-Q3-001",
    "category": "cocoa-beans",
    "manufacturer": "FTN Cocoa Processors Plc",
    "countryOfOrigin": "Nigeria",
    "materials": [
      { "name": "Cocoa beans", "percentage": 100, "origin": "Ondo State, Nigeria" }
    ],
    "weightKg": 25000,
    "packaging": { "type": "Jute bags", "recyclable": true }
  }'
```

**Response:**

```json
{
  "passportId": "DPP-NG-2025-COCOA-ABC123",
  "publicUrl": "https://passports.dpp-platform.com/p/DPP-NG-2025-COCOA-ABC123",
  "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?data=...",
  "complianceStatus": {
    "euDpp": "compliant",
    "eudr": "geolocation_verified",
    "gs1": "standard_format"
  },
  "carbonFootprint": {
    "totalKgCo2e": 105000,
    "perKg": 4.2,
    "breakdown": { "agriculture": 2.3, "processing": 0.8, "transport": 1.1 }
  }
}
```

---

## Carbon Calculation

Uses open-source LCA emission factors:

| Product | Agriculture | Processing | Transport | Total/kg |
|---------|------------|------------|-----------|----------|
| Cocoa beans | 2.3 | 0.8 | 1.1 | **4.2** |
| Palm oil | 3.1 | 1.2 | 0.9 | **5.2** |
| Lithium carbonate | 15.0 (mining) | 8.2 | 2.0 | **25.2** |

*Sources: Agribalyse, IPCC, Exiobase*

---

## Screens

### Dashboard (`/`)
- Stat: "47 passports generated"
- Big "Create Passport" button
- Table of recent passports with QR previews

### Create Form (`/passports/new`)
- Step 1: Product Identity (15 sec)
- Step 2: Materials & Composition (20 sec)
- Step 3: Generate (10 sec) → QR code appears

### Public Passport (`/p/:id`)
- EU DPP badge
- QR code
- Carbon footprint breakdown
- Materials traceability
- Compliance checkmarks

---

## Deployment

### Option 1: Railway (Recommended)

```bash
railway login
railway init
railway up
```

### Option 2: Docker Compose

```bash
docker-compose up --build
```

### Option 3: Render

1. Connect GitHub repo
2. Select `dpp-api` as service root
3. Set build command: `npm install && npm run build`
4. Set start command: `npm run start:prod`

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | API server port |
| `NUXT_PUBLIC_API_BASE` | `http://localhost:3001/api/v1` | Frontend API URL |

---

## Roadmap

- [ ] Multi-user auth (OAuth)
- [ ] Blockchain anchoring (Ethereum/Polygon)
- [ ] GS1 registry integration
- [ ] PDF export (Puppeteer)
- [ ] White-label / multi-tenant
- [ ] White-label for freight forwarders
- [ ] Auditor integration API
- [ ] Advanced LCA modeling (openLCA)

---

## License

MIT © Akin Olunloye, KaylonLabs

---

## Contact

- **Website:** [dpp-platform.com](https://dpp-platform.com) (soon)
- **Email:** akin@ashlabs.xyz
- **Demo booking:** [paywithaccount.com/schedify](https://paywithaccount.com/schedify)
- **Twitter:** [@akinolunloye](https://twitter.com/akinolunloye)

---

*Built with NestJS, Nuxt, TypeORM, SQLite, and QRServer.*

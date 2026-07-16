# Digital Product Passport (DPP) Platform — PRD
## Repo: https://github.com/Roqak/dpp-platform
## For: Opencode / AI Coding Agent
## Date: 2026-07-16
## Author: Akin Olunloye (KaylonLabs)

---

## 1. OVERVIEW

Build a working MVP of a **Digital Product Passport (DPP) generator** that African exporters and EU manufacturers can use to create QR-linked product passports for EU compliance.

**The 60-second pitch:** Give us your product data (origin, materials, weight) and we generate a QR-linked Digital Product Passport that EU buyers can scan.

**Why now:** EU Battery Passport mandate goes live Feb 2027. EUDR already active. African exporters need this yesterday.

---

## 2. ARCHITECTURE

```
┌─────────────┐      POST /passports       ┌──────────────┐      ┌─────────────┐
│   Nuxt UI   │ ──────────────────────────▶│  NestJS API  │──────▶│  SQLite DB  │
│  (Dashboard │                            │  (Business   │      │  (Passports │
│   + Form)   │ ◀──────────────────────────│   Logic)     │      │   + Users)   │
└─────────────┘      JSON + QR code URL    └──────────────┘      └─────────────┘
                                                        │
                                                        ▼
                                                 ┌─────────────┐
                                                 │  Passport   │
                                                 │  HTML Page  │
                                                 │ (Public URL)│
                                                 └─────────────┘
```

### Tech Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| API Framework | NestJS | ^10.3.0 |
| ORM | TypeORM | ^0.3.20 |
| Database | SQLite | 3 (via sqlite3) |
| Validation | class-validator | ^0.14.1 |
| API Docs | Swagger/OpenAPI | @nestjs/swagger |
| Frontend | Nuxt 3 | ^3.12.0 |
| UI Components | Nuxt UI | ^2.18.0 |
| Icons | Heroicons | via Nuxt UI |
| Styling | Tailwind CSS | via Nuxt UI |

---

## 3. WHAT'S ALREADY DONE ✅

The repo is scaffolded. These files exist and are written:

### API (`dpp-api/`)
- `src/main.ts` — NestJS bootstrap, Swagger setup
- `src/app.module.ts` — TypeORM SQLite connection
- `src/passports/passports.controller.ts` — POST/GET endpoints
- `src/passports/passports.module.ts` — Module wiring
- `src/passports/dto/create-passport.dto.ts` — Validation rules
- `src/passports/entities/passport.entity.ts` — Full schema
- `src/passports/services/passports.service.ts` — CRUD + ID generation + QR URL
- `src/passports/services/carbon.service.ts` — Open-source LCA emission factors
- `package.json` — Dependencies listed
- `tsconfig.json` — TypeScript config
- `Dockerfile` — Production build

### Frontend (`dpp-web/`)
- `app.vue` — Root with `<NuxtPage>`
- `pages/index.vue` — Dashboard with stats + passport table
- `pages/passports/new.vue` — 2-step create form + success state
- `pages/p/[id].vue` — Public passport page (EU badge, QR, carbon, compliance)
- `nuxt.config.ts` — Nuxt UI module, API base config, devServer port 3010
- `package.json` — Dependencies listed
- `Dockerfile` — Production build

### DevOps
- `docker-compose.yml` — API + web services
- `.gitignore` — Node, SQLite, env
- `README.md` — Full documentation
- `HANDOFF.md` — Previous handoff context

**Dependencies are NOT installed yet. Build has NOT been tested.**

---

## 4. WHAT YOU NEED TO BUILD 🔨

### Priority 1: Make It Actually Run (CRITICAL)

1. **Install dependencies in both workspaces**
   ```bash
   cd dpp-api && npm install
   cd ../dpp-web && npm install
   ```

2. **Fix any TypeScript / build errors**
   - Likely issues: missing `nest-cli.json`, `@nuxt/ui` auto-imports, entity decorators
   - Add `dpp-api/nest-cli.json` if missing
   - Ensure `experimentalDecorators: true` and `emitDecoratorMetadata: true` in tsconfig

3. **Add missing config files**
   - `dpp-api/nest-cli.json`:
     ```json
     {
       "$schema": "https://json.schemastore.org/nest-cli",
       "collection": "@nestjs/schematics",
       "sourceRoot": "src",
       "compilerOptions": {
         "deleteOutDir": true
       }
     }
     ```
   - `dpp-api/.eslintrc.js` (or flat config equivalent)

4. **Wire API ↔ Web communication**
   - The Nuxt app needs a server proxy to avoid CORS
   - Add a Nitro server route in `dpp-web/server/api/[...].ts`:
     ```typescript
     export default defineEventHandler(async (event) => {
       const config = useRuntimeConfig()
       const path = event.path.replace(/^\/api/, '')
       return await $fetch(`${config.public.apiBase}${path}`, {
         method: event.method,
         headers: getRequestHeaders(event),
         body: readBody(event),
       })
     })
     ```
   - Then frontend fetches `/api/passports` (relative) instead of full URL

5. **Verify both services boot**
   ```bash
   cd dpp-api && npm run start:dev    # Should serve on localhost:3011
   cd dpp-web && npm run dev          # Should serve on localhost:3010
   ```

### Priority 2: Feature Gaps

#### API Features

| Feature | Description | Files to Modify / Create |
|---------|-------------|--------------------------|
| **PDF Export** | `GET /passports/:id/pdf` — generate PDF of passport using Puppeteer | `passports.controller.ts`, `passports.service.ts`, new `pdf.service.ts` |
| **Demo Data Seeder** | Seed 20 sample passports on first run | New `database/seeder.service.ts`, call in `app.module.ts` |
| **Public Passport Endpoint** | `GET /passports/public/:id` — returns raw JSON for the public page | `passports.controller.ts` |
| **Email Notification** | Send passport link via email on creation | New `email.service.ts` (use console.log for MVP, or a simple SMTP provider) |
| **Validation Enhancements** | Country code validation, SKU format, weight > 0 | `create-passport.dto.ts` |
| **Error Handling** | Global exception filter, standardized error responses | New `common/filters/http-exception.filter.ts` |
| **Health Check** | `GET /health` endpoint for monitoring | New `health.controller.ts` |

#### Frontend Features

| Feature | Description | Files to Modify / Create |
|---------|-------------|--------------------------|
| **Server Proxy** | Nuxt server route to proxy API requests (avoids CORS) | `server/api/[...].ts` |
| **Loading States** | Skeleton loaders, error boundaries | All page components |
| **Form Validation** | Client-side validation before submit | `passports/new.vue` |
| **Toast Notifications** | Success/error toasts after actions | `app.vue` + composable `useToast()` |
| **Responsive Polish** | Mobile-first refinements | All `.vue` files |
| **SEO Meta Tags** | Dynamic meta for passport pages | `p/[id].vue` |
| **Print Styles** | Clean print CSS for passport page | `p/[id].vue` |
| **Landing Page** | Marketing landing at `/`, dashboard at `/dashboard` | New `pages/landing.vue`, move dashboard |

#### Dev / Deployment

| Feature | Description |
|---------|-------------|
| **Environment Config** | `.env.example` files for both workspaces |
| **Production Build** | Verify `npm run build` works in both |
| **Docker Verification** | `docker-compose up --build` should work end-to-end |

### Priority 3: Demo Polish (For Client Pitches)

| Feature | Why It Matters |
|---------|----------------|
| **Fake data seeder** | Populate DB with 20 sample passports for dashboard demo |
| **Demo mode flag** | `?demo=1` shows pre-filled form with FTN Cocoa data |
| **Animated QR generation** | Confetti or pulse animation when passport is created |
| **Passport PDF preview** | Inline PDF viewer on success screen |
| **Share buttons** | WhatsApp, Twitter, LinkedIn share with pre-filled text |

---

## 5. UI/UX DESIGN PRINCIPLES

### Aesthetic: Linear / Notion Minimalism
- Clean borders, subtle shadows
- Emerald green (`#10B981`) as primary accent
- High contrast, lots of whitespace
- Monospace for IDs and technical data
- No gradients, no heavy shadows

### Screens

#### Screen 1: Dashboard (`/` or `/dashboard`)
- **Stat card:** "47 passports generated" (dynamic from DB count)
- **Big CTA:** "Create Passport" button (emerald, prominent)
- **Table:** Recent passports with QR thumbnails, product name, manufacturer, origin, compliance badges
- **Columns:** Passport ID | Product | Manufacturer | Origin | QR | Link | Status

#### Screen 2: Create Form (`/passports/new`)
- **Step 1 — Product Identity (15 sec):**
  - Product Name (placeholder: "Nigerian Cocoa Beans — FTN Premium Grade")
  - SKU / Batch ID (placeholder: "FTN-CB-2025-Q3-001")
  - Category (dropdown: cocoa-beans, palm-oil, cotton-raw, lithium-carbonate, cobalt, nickel, graphite, textiles, batteries)
  - Manufacturer (placeholder: "FTN Cocoa Processors Plc")
  - Country of Origin (dropdown: Nigeria, Ghana, Mali, DRC, Zambia, Tanzania, Uganda, Kenya)
  - Weight in kg (placeholder: 25000)
- **Step 2 — Materials & Composition (20 sec):**
  - Material rows: Name | % | Origin (repeatable, "Add Material" button)
  - Packaging type (placeholder: "Jute bags")
- **Submit:** "Generate Passport" (emerald, large, with sparkles icon)
- **Success state:**
  - Big checkmark icon
  - "Passport Generated!" headline
  - QR code (large, centered)
  - Passport ID in monospace
  - Buttons: "View Passport" (primary), "Copy URL" (secondary)

#### Screen 3: Public Passport (`/p/:id`)
- **EU DPP Badge:** Green pulse dot + "EU DIGITAL PRODUCT PASSPORT — Verified · GS1 Standard · 2027 Compliant"
- **QR Code:** Large, centered
- **Product Identity:** Name, batch, manufacturer, origin
- **Sustainability Section:**
  - Total carbon footprint (big number)
  - Per kg breakdown
  - Bar chart or simple list of emission factors
- **Materials Section:** List with percentages and origins
- **Compliance Section:** Three green checkmarks — EU DPP, EUDR, GS1
- **Footer:** Passport ID, generation date, "Blockchain hash placeholder" text

---

## 6. DATA MODEL

### Passport Entity (SQLite via TypeORM)

```typescript
@Entity('passports')
class Passport {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() passportId: string;        // e.g. "DPP-NG-2025-COCOA-ABC123"
  @Column() productName: string;
  @Column({ nullable: true }) sku: string;
  @Column() category: string;
  @Column() manufacturer: string;
  @Column() countryOfOrigin: string;
  @Column({ type: 'simple-json', nullable: true })
    materials: { name: string; percentage: number; origin: string }[];
  @Column({ type: 'float', nullable: true }) weightKg: number;
  @Column({ type: 'simple-json', nullable: true })
    packaging: { type: string; recyclable: boolean };
  @Column({ type: 'simple-json', nullable: true })
    carbonFootprint: { totalKgCo2e: number; perKg: number; breakdown: Record<string, number> };
  @Column({ type: 'simple-json', nullable: true })
    complianceStatus: { euDpp: string; eudr: string; gs1: string };
  @Column({ nullable: true }) qrCodeUrl: string;
  @Column({ nullable: true }) publicUrl: string;
  @Column({ nullable: true }) pdfUrl: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
```

### Passport ID Format
```
DPP-{COUNTRY_CODE}-{YEAR}-{CATEGORY_CODE}-{UUID_SEGMENT}

Example: DPP-NG-2025-COCOA-ABC123
```

### Carbon Footprint Calculation

Use the existing `carbon.service.ts` emission factors:

| Product | Agriculture | Processing | Transport | Total/kg |
|---------|------------|------------|-----------|----------|
| Cocoa beans | 2.3 | 0.8 | 1.1 | **4.2** |
| Palm oil | 3.1 | 1.2 | 0.9 | **5.2** |
| Cotton raw | 8.3 | 2.1 | 1.5 | **12.0** |
| Lithium carbonate | 15.0 (mining) | 8.2 | 2.0 | **25.2** |
| Cobalt | 12.0 (mining) | 6.5 | 2.0 | **20.5** |
| Nickel | 9.0 (mining) | 5.0 | 1.8 | **15.8** |
| Graphite | 3.5 (mining) | 2.0 | 1.2 | **6.7** |
| Default | 1.0 | 0.5 | 0.5 | **2.0** |

---

## 7. API SPECIFICATION

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/passports` | Create a new passport |
| `GET` | `/api/v1/passports` | List all passports (newest first) |
| `GET` | `/api/v1/passports/:id` | Get passport by passportId |
| `GET` | `/api/v1/passports/:id/pdf` | Generate and return PDF |
| `GET` | `/api/v1/health` | Health check |

### POST /api/v1/passports

**Request Body:**
```json
{
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
}
```

**Response (201):**
```json
{
  "id": "uuid-here",
  "passportId": "DPP-NG-2025-COCOA-ABC123",
  "productName": "Nigerian Cocoa Beans",
  "sku": "FTN-CB-2025-Q3-001",
  "category": "cocoa-beans",
  "manufacturer": "FTN Cocoa Processors Plc",
  "countryOfOrigin": "Nigeria",
  "materials": [...],
  "weightKg": 25000,
  "packaging": { "type": "Jute bags", "recyclable": true },
  "carbonFootprint": {
    "totalKgCo2e": 105000,
    "perKg": 4.2,
    "breakdown": { "agriculture": 2.3, "processing": 0.8, "transport": 1.1 }
  },
  "complianceStatus": {
    "euDpp": "compliant",
    "eudr": "geolocation_verified",
    "gs1": "standard_format"
  },
  "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=...",
  "publicUrl": "https://dpp.ashlabs.xyz/p/DPP-NG-2025-COCOA-ABC123",
  "pdfUrl": null,
  "createdAt": "2026-07-16T...",
  "updatedAt": "2026-07-16T..."
}
```

---

## 8. ENVIRONMENT VARIABLES

### dpp-api/.env.example
```
PORT=3011
NODE_ENV=development
```

### dpp-web/.env.example
```
NUXT_PUBLIC_API_BASE=http://localhost:3011/api/v1
```

---

## 9. PORTS & DEPLOYMENT

| Service | Local Port | Live URL |
|---------|-----------|----------|
| DPP Web (Nuxt) | `localhost:3010` | https://dpp.ashlabs.xyz |
| DPP API (NestJS) | `localhost:3011` | https://dpp-api.ashlabs.xyz |

**Cloudflare Tunnel is already configured.** When services run on localhost:3010/3011, they are instantly live at the URLs above. No additional tunnel setup needed.

---

## 10. ACCEPTANCE CRITERIA (Definition of Done)

Before this is "demo-ready":

- [ ] `cd dpp-api && npm install && npm run start:dev` boots without errors on port 3011
- [ ] `cd dpp-web && npm install && npm run dev` boots without errors on port 3010
- [ ] Dashboard loads at `http://localhost:3010` showing passport table
- [ ] Create form submits successfully and shows QR code + passport URL
- [ ] Public passport page renders correctly at `/p/:id`
- [ ] Swagger docs accessible at `http://localhost:3011/api/docs`
- [ ] `docker-compose up --build` works end-to-end
- [ ] At least 5 seeded demo passports in database
- [ ] All console errors resolved
- [ ] No TypeScript compilation errors
- [ ] Mobile responsive on passport page

---

## 11. COMMANDS REFERENCE

```bash
# Clone and setup
git clone https://github.com/Roqak/dpp-platform.git
cd dpp-platform

# Install API deps
cd dpp-api && npm install

# Install Web deps
cd ../dpp-web && npm install

# Start API (Terminal 1)
cd dpp-api && npm run start:dev

# Start Web (Terminal 2)
cd dpp-web && npm run dev

# Docker Compose
docker-compose up --build

# API test
curl http://localhost:3011/api/v1/passports
curl -X POST http://localhost:3011/api/v1/passports \
  -H "Content-Type: application/json" \
  -d '{"productName":"Test","category":"cocoa-beans","manufacturer":"Test Co","countryOfOrigin":"Nigeria","materials":[{"name":"Cocoa","percentage":100,"origin":"Nigeria"}]}'

# Git workflow
git add -A && git commit -m "feat: ..."
git push origin main
```

---

## 12. TARGET CLIENTS (For Demo Data)

Use these for seed data and demo mode:

| Company | Product | Origin | Deal Size |
|---------|---------|--------|-----------|
| FTN Cocoa Processors | Nigerian Cocoa Beans | Nigeria | €1,500 pilot |
| Atlantic Lithium | Lithium Carbonate | Ghana | €3,000 pilot |
| Nyobolt | Battery Cells | UK | €2,500 pilot |
| SIFCA | Palm Oil | Côte d'Ivoire | €2,000 pilot |
| Savannah Cotton | Raw Cotton | Mali | €1,500 pilot |

---

## 13. NOTES & CONSTRAINTS

- **Zero auth for MVP** — Demo mode. Single-user. No login wall.
- **SQLite, not Postgres** — Zero infrastructure. Single file DB.
- **No payment integration yet** — Pilots invoiced manually (Paystack/Stripe/Wise)
- **QR codes** — Use `api.qrserver.com` (free, no API key needed)
- **PDF export** — Use Puppeteer (already in package.json dependencies)
- **Carbon data** — Static lookup table is fine for MVP. Real LCA integration comes later.
- **Compliance badges** — All green for MVP. Real verification comes later.

---

## 14. QUESTIONS (If Blocked)

1. Should the public passport page (`/p/:id`) be SSR or client-side fetched?
2. Do you want email sending via Resend, Postmark, or just console.log for MVP?
3. For demo seeder, which specific companies/products should appear?
4. Should I add basic auth (simple password) for the dashboard?
5. Priority: PDF export first, or email notification first?

---

*PRD prepared by: Hermes Agent*
*Repo: https://github.com/Roqak/dpp-platform*
*Contact: akin@ashlabs.xyz*
*Demo booking: https://paywithaccount.com/schedify*

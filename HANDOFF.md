# Opencode Handoff — DPP Platform
## Repo: https://github.com/Roqak/dpp-platform
## Branch: main
## Date: 2026-07-16
## Next Phase: MVP Feature Completion + Demo Readiness

---

## WHAT'S ALREADY DONE ✅

### Architecture
- **Monorepo:** `dpp-api/` (NestJS) + `dpp-web/` (Nuxt 3) + `docker-compose.yml`
- **Database:** SQLite via TypeORM, auto-sync, zero-config
- **API Base:** `http://localhost:3011/api/v1`
- **Web Base:** `http://localhost:3010`

### API (`dpp-api/`)
| File | Status |
|------|--------|
| `src/main.ts` | ✅ NestJS app, Swagger docs at `/api/docs` |
| `src/app.module.ts` | ✅ TypeORM SQLite connection |
| `src/passports/passports.controller.ts` | ✅ POST/GET endpoints |
| `src/passports/passports.module.ts` | ✅ Module wiring |
| `src/passports/dto/create-passport.dto.ts` | ✅ Validation rules |
| `src/passports/entities/passport.entity.ts` | ✅ Full schema |
| `src/passports/services/passports.service.ts` | ✅ CRUD + ID generation + QR URL |
| `src/passports/services/carbon.service.ts` | ✅ Open-source LCA emission factors |

### Frontend (`dpp-web/`)
| File | Status |
|------|--------|
| `app.vue` | ✅ Root with `<NuxtPage>` |
| `pages/index.vue` | ✅ Dashboard with stats + passport table |
| `pages/passports/new.vue` | ✅ 2-step create form + success state |
| `pages/p/[id].vue` | ✅ Public passport page (EU badge, QR, carbon, compliance) |
| `nuxt.config.ts` | ✅ Nuxt UI module, API base config |

### DevOps
| File | Status |
|------|--------|
| `docker-compose.yml` | ✅ API + web services |
| `dpp-api/Dockerfile` | ✅ Production build |
| `dpp-web/Dockerfile` | ✅ Production build |
| `.gitignore` | ✅ Node, SQLite, env |
| `README.md` | ✅ Full documentation |

---

## WHAT NEEDS TO BE BUILT 🔨

### Priority 1: Make It Actually Run (Critical)

The scaffold is written but **NOT tested or running**. Dependencies are NOT installed.

1. **Install deps in both workspaces**
   ```bash
   cd dpp-api && npm install
   cd ../dpp-web && npm install
   ```

2. **Fix any TypeScript / build errors**
   - Likely issues: `@nuxt/ui` imports, missing test config, entity decorators

3. **Add missing config files**
   - `dpp-api/.eslintrc.js` (or use flat config)
   - `dpp-api/nest-cli.json` (for `nest build`)
   - `dpp-web/tailwind.config.ts` (if Nuxt UI needs it)

4. **Wire API → Web communication**
   - The Nuxt app needs a server proxy or direct fetch to API
   - Consider adding a Nitro proxy route in Nuxt

### Priority 2: Feature Gaps

#### API Features
| Feature | Description | Files to Modify |
|---------|-------------|-----------------|
| **PDF Export** | `GET /passports/:id/pdf` — generate PDF of passport using Puppeteer | `passports.controller.ts`, `passports.service.ts` |
| **Email Notification** | Send passport link via email on creation | New `email.service.ts` |
| **Validation Enhancements** | Country code validation, SKU format, weight > 0 | `create-passport.dto.ts` |
| **Error Handling** | Global exception filter, standardized error responses | New `common/filters/` |
| **Health Check** | `GET /health` endpoint for monitoring | `app.module.ts` |
| **Rate Limiting** | Prevent abuse on public endpoints | `app.module.ts` + Throttler |

#### Frontend Features
| Feature | Description | Files to Modify |
|---------|-------------|-----------------|
| **Server Proxy** | Nuxt server route to proxy API requests (avoids CORS) | New `server/api/` routes |
| **Loading States** | Skeleton loaders, error boundaries | All page components |
| **Form Validation** | Client-side validation before submit | `passports/new.vue` |
| **Toast Notifications** | Success/error toasts after actions | `app.vue` + composable |
| **Responsive Polish** | Mobile-first refinements | All `.vue` files |
| **SEO Meta Tags** | Dynamic meta for passport pages | `p/[id].vue` |
| **Print Styles** | Clean print CSS for passport page | `p/[id].vue` |

#### Dev / Deployment
| Feature | Description |
|---------|-------------|
| **Environment Config** | `.env.example` files for both workspaces |
| **Production Build** | Verify `npm run build` works in both |
| **Docker Verification** | `docker-compose up --build` should work end-to-end |
| **Railway Config** | `railway.json` or `render.yaml` for one-click deploy |

### Priority 3: Demo Polish (For Client Pitches)

| Feature | Why It Matters |
|---------|----------------|
| **Fake data seeder** | Populate DB with 20 sample passports for dashboard demo |
| **Demo mode flag** | `?demo=1` shows pre-filled form with FTN Cocoa data |
| **Animated QR generation** | Confetti or pulse animation when passport is created |
| **Passport PDF preview** | Inline PDF viewer on success screen |
| **Share buttons** | WhatsApp, Twitter, LinkedIn share with pre-filled text |
| **Landing page** | `/` should show marketing content, dashboard at `/dashboard` |

---

## TECH STACK REFERENCE

| Layer | Technology | Version |
|-------|-----------|---------|
| API Framework | NestJS | ^10.3.0 |
| ORM | TypeORM | ^0.3.20 |
| Database | SQLite | 3 (via sqlite3) |
| Validation | class-validator | ^0.14.1 |
| Docs | Swagger/OpenAPI | @nestjs/swagger |
| Frontend | Nuxt 3 | ^3.12.0 |
| UI | Nuxt UI | ^2.18.0 |
| Icons | Heroicons | via Nuxt UI |
| Styling | Tailwind CSS | via Nuxt UI |
| Deployment | Docker / Railway | — |

---

## DESIGN PRINCIPLES

1. **Linear aesthetic** — The user loves Linear/Notion-style minimalism. Clean borders, subtle shadows, emerald accents.
2. **Mobile-first** — EU buyers will scan QR codes on phones. Passport page must look perfect on mobile.
3. **Zero auth for MVP** — Demo mode. Single-user. No login wall.
4. **SQLite, not Postgres** — Zero infrastructure. Single file DB.
5. **GS1 compliance language** — Every UI element should reference EU standards. Green badges. Checkmarks. Official-looking.

---

## ENVIRONMENT VARIABLES NEEDED

### dpp-api/.env.example
```
PORT=3001
NODE_ENV=development
DATABASE_NAME=dpp.db
```

### dpp-web/.env.example
```
NUXT_PUBLIC_API_BASE=http://localhost:3001/api/v1
```

---

## ACCEPTANCE CRITERIA (Definition of Done)

Before calling this "demo-ready":

- [ ] `cd dpp-api && npm install && npm run start:dev` boots without errors
- [ ] `cd dpp-web && npm install && npm run dev` boots without errors
- [ ] Dashboard loads at `http://localhost:3000` showing passport table
- [ ] Create form submits successfully and shows QR code + passport URL
- [ ] Public passport page renders correctly at `/p/:id`
- [ ] Swagger docs accessible at `http://localhost:3001/api/docs`
- [ ] `docker-compose up --build` works end-to-end
- [ ] At least 5 seeded demo passports in database
- [ ] All console errors resolved

---

## CONTEXT FROM USER PROFILE

- **Name:** Akin Olunloye
- **Company:** KaylonLabs
- **Aesthetic:** Linear/Notion minimalism, emerald green accents, high-contrast
- **Target clients:** Nigerian exporters, EU battery startups, EU fashion brands
- **Revenue model:** €1,500-€3,000 pilots first, then €499/mo SaaS
- **Demo urgency:** Needs working MVP within 7 days for client pitches
- **Server:** Already running Docker, can host on Railway/Render
- **Domain:** Will register `dpp-africa.com` or `passportafrica.com`

---

## USEFUL COMMANDS

```bash
# Start both services
cd dpp-api && npm run start:dev    # Terminal 1
cd dpp-web && npm run dev         # Terminal 2

# Docker
docker-compose up --build

# API test
curl http://localhost:3001/api/v1/passports
curl -X POST http://localhost:3001/api/v1/passports \
  -H "Content-Type: application/json" \
  -d '{"productName":"Test","category":"cocoa-beans","manufacturer":"Test Co","countryOfOrigin":"Nigeria","materials":[{"name":"Cocoa","percentage":100,"origin":"Nigeria"}]}'

# Git
git add -A && git commit -m "feat: ..."
git push origin main
```

---

## QUESTIONS FOR AKIN (If Blocked)

1. Should the public passport page (`/p/:id`) be server-side rendered or client-side fetched?
2. Do you want email sending via Resend, Postmark, or SMTP?
3. For the demo seeder, which specific companies/products should appear? (e.g., "FTN Cocoa", "Atlantic Lithium Ewoyaa")
4. Should I add a basic auth layer (even just a simple password) for the dashboard?
5. Priority: PDF export first, or email notification first?

---

*Handoff prepared by: Hermes Agent*
*Repo: https://github.com/Roqak/dpp-platform*
*Contact: akin@ashlabs.xyz*

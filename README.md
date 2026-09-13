# Hussain & Co — MERN website

Responsive, animated chemical importer/exporter website using **MongoDB, Express, React, and Node.js**. Includes 52 client-supplied products, six category options, search, individual product pages, company/Chief Executive section, contact links, and an inquiry form with server validation.

## VS Code mein jaldi chalayein

1. ZIP extract karein. **hussain-co-mern** folder VS Code mein open karein.
2. Node.js **22.12 or newer** install hona chahiye.
3. VS Code → Terminal → New Terminal. Project root mein:

```powershell
npm install
Copy-Item server/.env.example server/.env
npm run build
npm start
```

Open **http://localhost:5000**. Frontend and backend are served together. API: **http://localhost:5000/api/health**.

While editing in a normal local terminal, use `npm run dev` for React hot reload on **http://localhost:5173** and the API on port 5000. Stop `npm start` first so the port is available. In restricted Windows sandboxes, Vite dependency scanning may be blocked; the tested `npm run build` + `npm start` flow avoids that limitation.

On macOS/Linux, use `cp server/.env.example server/.env` instead of `Copy-Item`.

The supplied configuration runs in **demo mode** so the website works immediately without MongoDB. Form submissions in this mode are held only in server memory, disappear on restart, and are not emailed. The form and success screen explicitly show this. Demo mode is blocked when `NODE_ENV=production`.

## Asli MongoDB connect karein

Use a local MongoDB installation, MongoDB Atlas, or the optional Docker setup:

```powershell
docker compose up -d
```

Edit **server/.env**:

```dotenv
DEMO_MODE=false
MONGODB_URI=mongodb://127.0.0.1:27017/hussain_co
```

For Atlas, replace the URI with your own connection string. Keep database credentials only in `server/.env` or your host's secret settings; never place them in React code.

```powershell
npm run seed
npm run dev
```

`seed` upserts the 52 products by slug. It updates existing matching product fields; it does not delete inquiries. Re-run after changing the source catalog if those changes should also update MongoDB. In MongoDB mode, the API reads the database, not the source catalog. If the connection fails, startup fails clearly; there is no silent fallback to memory.

Saved inquiries are in the `inquiries` collection (view with MongoDB Compass or Atlas). No public endpoint exposes them. An admin dashboard and automatic email notifications are not included. The listed email/phone/WhatsApp links work independently of the inquiry database.

## Edit company, images, products

| What to change | File |
| --- | --- |
| Company name, contacts, address, Chief Executive, photos | `shared/company.js` |
| Products, categories, packing, origin, grades | `shared/catalog.js` |
| Home and navigation | `client/src/App.jsx` |
| Catalog, product, company, contact pages | `client/src/Pages.jsx` |
| Colors, responsive layout, motion | `client/src/styles.css` |
| Local images | `client/public/images/` |
| API routes and input validation | `server/src/app.js` |
| MongoDB product/inquiry schemas | `server/src/models.js` |

Add `founder.jpg` to the images folder and set `founderImage: '/images/founder.jpg'` in company data. The role remains **Chief Executive**, as printed on the card; founder status has not been assumed. Replace `companyImage` with a real company/warehouse photograph. An approved message can be added in `founderMessage`; no fabricated quote is used.

For actual SDS/TDS downloads, put approved PDF files in `client/public/documents/` and set each product's `sdsUrl` / `tdsUrl` to the local path. Buttons appear only when a real path is configured. Keep `cas`, purity, grade, and packaging aligned with the supplier documentation.

## Build and run the full application

```powershell
npm run test
npm run build
npm start
```

After a build, Express serves the React website and `/api` together at **http://localhost:5000**. Route refreshes such as `/products/xylene` work through the SPA fallback. Vite is only required during development.

## Domain / live deployment

Deploy the **full repository** to a Node.js-capable host with a MongoDB connection. Build command: `npm ci && npm run build`. Start command: `npm start`. Set `NODE_ENV=production`, `DEMO_MODE=false`, `MONGODB_URI`, and `CLIENT_ORIGIN=https://your-domain` in host settings. Set `TRUST_PROXY` only to the exact trusted proxy hop count used by your host. Run `npm run seed` once using that environment, then connect your domain and enable HTTPS using the host's DNS instructions.

This repository is **not deployed**. A domain alone does not host a Node server or MongoDB. The client is configured for same-origin `/api`; deploying the React files alone will not provide the backend. If splitting frontend and backend across hosts, configure a reverse proxy for `/api` and update the API origin policy.

## Details still needed from the company

- Original transparent logo file, Chief Executive photograph, and real company/facility images.
- Approved company history, year established, and description of import/export services.
- Full names/identities for Cobalt 12%, Ethyal Glycol, Acrylic, Nitrosol, Monomehpo, Agrasa; confirm spelling of Maleic Anhydrous, Pathalic Anhydrous, Cypermethrine, Chlorfenpyr, and Dimethmorp.
- Approved technical specifications, CAS numbers, SDS/TDS, exact packing sizes, and any certifications to display.
- Final domain, hosting choice, MongoDB connection, and inquiry handling process.

The uncertain names remain labelled for specification confirmation, not silently replaced with inferred substances. No pricing, availability guarantees, certifications, application dosages, or handling instructions have been invented. Technical materials use an inquiry flow rather than checkout.

## Checks

`npm test` covers catalog count/filtering/details, invalid inquiries, demo success, database-write failures, schema validation, and malformed requests. A production build verifies React compilation. Live database connectivity requires your MongoDB environment and is separate from schema/API tests. See `VALIDATION.md` for the checks actually run on this deliverable.

Catalog update: Solvents now contains 26 entries (including separate percentage variants), and Glycols contains 5. Other categories retain their previous products. T20 is retired from the active catalog; historical database records are preserved but excluded by the API. Run `npm run seed` after connecting MongoDB to apply the updated records.

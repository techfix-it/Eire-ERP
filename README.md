# Eire-ERP: Integrated Logistics & Business Management Ecosystem

[![Security: Next.js 15 Protected](https://img.shields.io/badge/Security-Next.js%2015%20Protected-emerald.svg)](https://nextjs.org)
[![Infrastructure: Server--Side Only](https://img.shields.io/badge/Infrastructure-Server--Side%20Only-blue.svg)]()
[![Compliance: GDPR / Revenue IE](https://img.shields.io/badge/Compliance-GDPR%20%2F%20Revenue%20IE-orange.svg)]()

## 📌 Project Overview
Eire-ERP is a proprietary High-Potential Start-Up (HPSU) solution developed by **Techfix-IT Ltd**. The platform is built on **Next.js 15 (App Router)**, utilizing a hardened architecture designed to support the scaling of IT services and logistics in the Irish SME market.

By moving all business logic and database interactions to the **Server-Side**, Eire-ERP ensures that sensitive commercial data and Irish client information remain inaccessible to client-side attacks.

---

## 🔒 Security-First Architecture (STEP Compliance)

Unlike standard SPAs, Eire-ERP implements a multi-layer security model to comply with EU GDPR and financial data integrity standards:

### 1. Zero-Client Logic (Server Components)
All data fetching (Inventory, Fleet, Financials) is performed via **React Server Components (RSC)**. 
* **Benefit:** Database queries are executed within the server infrastructure. No API endpoints are exposed or visible in the browser's "Network" tab for initial page loads.
* **Database Isolation:** Connection strings and logic are encapsulated in `src/lib/db.ts`, strictly unreachable from the frontend.

### 2. Edge Middleware & RBAC
A global **Middleware Layer** (`src/middleware.ts`) intercepts all requests:
* **Session Integrity:** Validates secure, `httpOnly` and `SameSite: Strict` cookies before allowing page rendering.
* **Role-Based Access Control (RBAC):** Access is restricted based on user roles (Admin, Technician, Logistics), ensuring that a delivery driver cannot access the "Profitability (DRE)" or "Payroll" modules.

### 3. API Isolation & Request Protection
Our internal API routes (`src/app/api/`) act as isolated micro-services:
* **Payload Validation:** All incoming data is sanitized and validated on the server.
* **CSRF Protection:** Native Next.js protection against Cross-Site Request Forgery.

---

## 🛠 Tech Stack
* **Framework:** Next.js 15 (App Router)
* **Backend:** Node.js Server Environment
* **Database Layer:** SQLite (Development) / PostgreSQL (Production) via `better-sqlite3` & `src/lib/db.ts`
* **Security:** AES-256 Data Encryption, Cloudflare WAF
* **Deployment:** Vercel (Region: Ireland-East) for full GDPR Data Residency compliance.

---

## 🚀 Key Modules

### 1. Smart Logistics (Irish Eircode Integration)
The core logistics engine validates Irish addresses using the **Eircode API**, feeding our proprietary **Smart Routing Algorithm** to optimize last-mile delivery for the Techfix-IT fleet in Mullingar.

### 2. Live-Sync Inventory & POS
A unified omnichannel inventory that bridges the physical workshop in Westmeath with the `shop.techfix-it.ie` e-commerce platform.

### 3. Financial Engine & DRE
Automated Profit & Loss (DRE) and Cash Flow reporting, designed to meet **Irish Revenue** standards and provide transparency for investors.

---

## 👥 Authors & IP Ownership
* **Luiz** - Lead Architect & CTO (Technical Founder)
* **Fabio** - Product Strategy & CEO (Operational Founder)

**Proprietary Notice:** All source code, algorithms, and technical documentation are the exclusive Intellectual Property (IP) of **Techfix-IT Ltd**. Unauthorized access or distribution is strictly prohibited under the Founders' Agreement and Irish Law.

---
© 2026 Techfix-IT Ltd. Mullingar, Co. Westmeath, Ireland.

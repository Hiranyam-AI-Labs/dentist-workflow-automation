# Universal Hiranyam AI Labs 2-Pager Official Letterhead Proposal & Zero-Whitespace Standard (`SPEC-ENG-PROPOSAL-001` / `ADR-0022`)

> **Authoritative Engineering & Design Specification for all Commercial & Technical Proposals generated across Hiranyam AI Labs.**  
> **Status:** MANDATORY P0 STANDARD | **Effective:** 2026-09-28 | **Reference Implementation:** `Arogyam/scripts/generate_aarogyam_proposal_pdf.py`

---

## 1. Core Mandate

Whenever an AI agent or engineer generates a commercial proposal, scope of work (SOW), or client quotation for ANY client under **Hiranyam AI Labs**, it MUST be delivered as an **exact 2-Page (`Page 1 of 2` and `Page 2 of 2`) Print-Ready Vector PDF on the Official Hiranyam AI Labs Corporate Letterhead**, with **98%+ vertical page utilization (zero wasted white space and zero 3rd-page orphan spillover)**.

---

## 2. Mandatory Letterhead & Visual Architecture Requirements

### 2.1 Official Hiranyam AI Labs Corporate Letterhead Header (Every Page)
1. **Left Emblem:** Official Hiranyam AI Labs Sri Yantra & Lotus crest (`hiranyam_ai_labs_logo_final.jpg` / `Documents/hiranyam_ai_labs_logo.jpg`).
2. **Corporate Stationery Block (Center-Left):**
   - Title: **HIRANYAM AI LABS** (`HIRANYAM AI` in Crisp White `#FFFFFF` + `LABS` in Metallic Gold `#D4AF37`).
   - Tagline: `ENTERPRISE AI ORCHESTRATION • AUTONOMOUS WORKFLOWS • DIGITAL PLATFORMS` in Saffron Orange (`#EA892F`).
   - Contact Line: `Web: www.hiranyamai.com | Email: agent@hiranyamai.com | HQ: Pune, Maharashtra, India` (Always use `agent@hiranyamai.com`).
   - Reference & Date Line: `Ref. No.: HAL/PROP/<YEAR>/<CLIENT>-<MMDD> • Date: <DD Month YYYY>`.
3. **Right Client Badge:** Client's official logo framed inside an elevated white rounded card with a `0.9pt` Metallic Gold (`#D4AF37`) border.
4. **Panchatattva Multi-Color Accent Ribbon:** 4-segment horizontal ribbon beneath the dark `#081534` header banner (`Royal Indigo #393185` + `Saffron Orange #EA892F` + `Metallic Gold #D4AF37` + `Pearl Emerald #0D9488`), paired with a 3-color vertical decorative rib along the left page border.

### 2.2 Formal Consultation Context & Cover Note (Top of Page 1)
1. **Addressee & Metadata Split Box:**
   - Left cell (`#F6F5FC` Soft Lavender): `TO, The Founder & Managing Director, <Client Name>` + industry descriptor.
   - Right cell (`#FFFBEB` Soft Gold): `Proposal Ref`, `Date of Issue` (today's date), `Ref. Discussion` (explicitly referencing yesterday's / recent executive consultation with the Owner), and `Engagement Model` (`Annual Managed Subscription`).
2. **Executive Cover Note:** A warm, authoritative cover paragraph thanking the Owner for the consultation held on `<Previous Day Date>` and introducing the turnkey scope of work.
3. **4-Stage Vector Architecture Blueprint:** A colorful 4-node vector flowchart (`ReportLab Drawing`) illustrating how the Client's Web/App Touchpoints, AI & Workflow Engine (never mention internal tool names like `n8n`), Payment/Scheduling Engine, and Role-Based Portals interconnect.

### 2.3 Exact 2-Page Full-Canvas Utilization & Zero-Whitespace Calibration
1. **Strict 2-Pager Target (`Page 1 of 2` & `Page 2 of 2`):**
   - **Page 1** houses: Letterhead Header + Addressee & Date Box + Executive Cover Note + 4-Stage Vector Architecture Blueprint + **Complete Pillar 01 (`[01]`–`[06]` Colorful 2x3 Feature Grid)**.
   - **Page 2** houses: Letterhead Header + **Complete Pillar 02 (`[01]`–`[06]` Colorful 2x3 Feature Grid)** + **Commercial Investment & 18% GST Breakdown Table** + **Important Commercial Note on Third-Party Exclusions** + **Dual-Party Authorization & Acceptance Sign-Off Block**.
2. **Zero Wasted Whitespace & Enlarged Typography:**
   - Calibrate font sizes (`7.45pt` / `leading 10.05pt` on Page 1; `6.95pt–7.1pt` / `leading 8.85pt–9.0pt` on Page 2) and table cell padding (`4.8pt` on Page 1; `3.1pt` on Page 2) so that **both Page 1 and Page 2 fill 98%–99% of the vertical frame** right down to the bottom border without spilling a single block onto Page 3.
   - Always register Windows TrueType Unicode fonts (`SegoeUI` / `ArialUnicode`) so the Indian Rupee symbol (`₹`) and arrows (`→`) render as native vector glyphs without fallback boxes (`■` / `□`).

### 2.4 Mandatory Commercial GST Breakdown & Third-Party Exclusions Clause
1. **Explicit 18% GST Calculation:** Always show `Base Annual Fee`, `GST (18%)`, and `Total Payable (Incl. GST)` (both exact decimal and rounded rupee figures) for each pillar and the combined total.
2. **Zero Source-Code Buyout Mention & Zero Internal Tool Naming:** Position the package strictly as an **Annual Managed Subscription Model** and describe workflow capabilities under the **Hiranyam Intelligent Workflow & AI Automation Engine** (never output `n8n` / `N10`).
3. **Third-Party Tools & Actuals Exclusions Box:** Always include a bordered Saffron-tinted callout box explicitly excluding:
   - Cloud hosting, domain registration/renewal, VPS servers, video storage bandwidth, and CDN charges.
   - AI & LLM token consumption charges (OpenAI / LLM API usage credits).
   - Official Meta WhatsApp Business API onboarding, BSP base plans, and per-message conversation charges.
   - Payment gateway onboarding/setup fees and per-transaction MDR charges.
   - Stating clearly that third-party tools will be integrated as and when needed and their charges borne directly by the client at actuals.

### 2.5 Mathematically Centered `"Powered by Hiranyam AI Labs"` Footer Strip
- In the bottom anchored footer strip (`10.5mm` height, `#FFFFFF` background, `0.9pt #E2E0EE` top delimiter), compute the exact width of `[Diamond Icon + Gap + "Powered by Hiranyam AI Labs"]` via `canvas.stringWidth("Powered by Hiranyam AI Labs", FONT_BOLD, 8.8)`:
  ```python
  total_badge_width = (diamond_radius * 2.0) + gap_between + text_width
  unit_start_x = (page_width - total_badge_width) / 2.0
  ```
- This guarantees **100% mathematical horizontal centering** at `page_width / 2.0` (`105mm` on A4), flanked by `Ref: <RefNo> • agent@hiranyamai.com` on the left and `Page X of 2` on the right.

---

## 3. Closed-Loop Visual Verification Protocol (Mandatory Before Delivery)

Every time a proposal PDF is generated or updated, the agent MUST:
1. Run the ReportLab generator script (`python scripts/generate_<client>_proposal_pdf.py`).
2. Visually inspect the rendered pages using `view_file` on the generated `.pdf`.
3. Verify:
   - Total page count is **exactly 2 pages (`Page 1 of 2` and `Page 2 of 2`)**.
   - Bottom whitespace above the footer frame is **< 8mm** on both Page 1 and Page 2.
   - `♦ Powered by Hiranyam AI Labs` is mathematically centered with zero text overlap.
   - `agent@hiranyamai.com` and all `₹` symbols render cleanly.

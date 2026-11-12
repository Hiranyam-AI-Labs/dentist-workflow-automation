# UI/UX Design System & Experience Standards

This document defines the mandatory, company-wide UI/UX Design Principles, Interaction Standards, and Design System rules that must be followed across all client web applications, dashboards, portals, and mobile interfaces developed under the organization.

---

## 1. Core Experience Philosophy

1. **End-User Delight & Frictionless Interaction**: Every view, dashboard, and public portal must be intuitive, self-explanatory, and visually pleasing on first load.
2. **Sub-100ms Perceived Latency**: Use non-blocking background polling, optimistic UI updates, and zero full-page reloads for tab switches, filters, and searches.
3. **Clarity Over Complexity**: Display critical business KPIs and decision-making data prominently; collapse secondary metadata into clean modals or slide-overs.

---

## 2. Visual Hierarchy & Layout Architecture

1. **Natural Scanning Flow**:
   - Organize screens following the **F-Pattern** (for text-heavy lists and chat histories) and **Z-Pattern** (for landing pages and KPI overview dashboards).
2. **Generous Whitespace & Card Elevation**:
   - Group related information into distinct cards using `bg-white`, subtle borders (`border-slate-200`), and soft shadows (`shadow-sm`, `shadow-md`).
   - Maintain consistent padding (`p-4` to `p-6`) and spacing (`space-y-4` to `space-y-6`).
3. **Typography Scale & Hierarchy**:
   - **Display / KPI Numbers**: Bold, large text (`text-2xl` to `text-3xl`, `font-bold font-sans`).
   - **Section Headers**: Clean uppercase tracking (`text-xs font-bold uppercase tracking-wider text-slate-500`).
   - **Body & Chat Text**: High-legibility font (`text-xs` to `text-sm`, `leading-relaxed text-slate-800`).
   - **Numbers, Currency & Timestamps**: Monospace font (`font-mono text-slate-600`) for precision alignment.

---

## 3. Color System & Semantic Palette (WCAG 2.1 AA Compliant)

All color combinations must achieve a **minimum contrast ratio of 4.5:1** for standard text and **3:1** for large text/icons.

| Semantic Purpose | Tailwind Classes | Visual Appearance & Meaning |
| :--- | :--- | :--- |
| **🚨 Urgent Escalation** | `bg-rose-600 text-white animate-pulse` | High urgency (Owner handoff, critical alert). |
| **🔥 Hot Lead / Priority** | `bg-rose-100 text-rose-700 border-rose-200` | Score ≥ 70, ready to buy/close. |
| **⚡ Warm Lead / Engaged** | `bg-amber-100 text-amber-700 border-amber-200` | Score 40–69, exploring options. |
| **❄️ Cold Lead / Early** | `bg-blue-100 text-blue-700 border-blue-200` | Score < 40, general inquiry. |
| **📞 Callback / Active** | `bg-emerald-100 text-emerald-800 border-emerald-200` | Scheduled phone call or action needed. |
| **⚡ AI Tokens & Cost** | `bg-purple-100 text-purple-800 border-purple-200` | Token consumption and live Rupee (₹) cost. |
| **Neutral / Background** | `bg-slate-50 text-slate-900 border-slate-200` | App shell, borders, and sidebar backgrounds. |

---

## 4. Responsive, Device-Agnostic & Mobile-First Execution

1. **Fluid Multi-Device Layout Mandate**:
   - **Mobile Portrait & Landscape (`360px – 768px`)**: Single-column vertical card stacks, responsive height containers with `overflow-y: auto`, touch-friendly targets (minimum 44x44px), and native touch swipe gesture navigation.
   - **Tablet (`768px – 1024px`)**: Collapsible sidebars, 2-column card grids, flexible flexbox headers.
   - **Desktop (`≥ 1024px`)**: Full multi-column split-view layout (side-by-side grids, live conversation stream, context panels).
2. **Anti-Pattern Prevention (Forbidden Patterns)**:
   - NEVER use hardcoded fixed pixel grid widths (e.g. `420px` sidebars) without mobile breakpoint collapses.
   - NEVER set fixed `100vh` on slides or main containers without granting internal or viewport scrollability (`overflow-y: auto`).
   - NEVER hide interactive controls on mobile without providing touch alternatives.
3. **Fixed Headers & Touch Scroll Containers**:
   - Application topbars and navigation footers must remain `sticky` or `fixed`.
   - Touch scrolling (`-webkit-overflow-scrolling: touch`) must be smooth across mobile viewports.

---

## 5. Micro-Interactions, Feedback & Safety

1. **Active & Hover States**:
   - Every interactive button, row, and tab must provide immediate visual feedback (`hover:bg-slate-50`, `hover:border-emerald-300`, `active:scale-[0.98] transition`).
2. **Guardrails for Destructive Actions**:
   - Never delete data or reset test histories on a single accidental click.
   - Mandatory modal confirmation dialog with bold warning copy, clear action button (`bg-rose-600 text-white`), and easy cancel (`Escape` or Cancel button).
3. **Live Activity Indicators**:
   - Live polling and server health must be communicated with gentle pulsing green dots (`bg-emerald-500 animate-pulse`).

---

## 6. Empty, Loading & Error States

1. **No Blank Screens**:
   - Empty lists must render an intuitive icon, a clear title (e.g., *"No Conversations Yet"*), and a helpful onboarding hint (e.g., *"Send a WhatsApp message to +91 ... to start"*).
2. **Skeleton & Shimmer Loaders**:
   - Display subtle pulse animations while fetching initial datasets rather than blank white boxes.
3. **Graceful Network Handling**:
   - Display a non-intrusive warning badge if the background polling fails or server is temporarily unreachable, and retry automatically.

---

## 7. Accessibility (a11y) & Inclusivity

- **Keyboard Navigation**: Full support for `Tab`, `Shift+Tab`, `Enter`, and `Escape` (to dismiss modals).
- **Descriptive Labels**: All icon-only buttons must have `title` and `aria-label` attributes.
- **Multilingual Readability**: Standard support for multi-script rendering (English, Devanagari Marathi, Devanagari Hindi) without font clipping or line height distortions.

---

## 8. Thoughtful Content, Meaningful Architecture & Anti-Placeholder Policy (P0 Standard)

1. **Anti-Placeholder Law**: Under no circumstances may any website, portal, dashboard, or presentation deck contain robotic numbered headings (e.g. *"Micro-Craft 1"*, *"Feature 2"*, *"Card 3"*), generic placeholder text (*"Lorem Ipsum"*, *"Sample description"*), or lazy boilerplate.
2. **Deep Domain Authenticity**: Even if an application or website is a basic MVP, quick prototype, or single-page static site, the architecture and content must be **deeply well thought of, presentable, and contextually meaningful**. Every section heading, badge, label, and copy block must reflect the client's genuine industry vocabulary, cultural context, and business credibility.
3. **Presentable Semantic Navigation**: Top navigation bars, drawer menus, and footers must use polished, professional, and descriptive category labels (e.g. *"Artisanal Details"*, *"Visual Portfolio"*, *"Vedic Rituals"*, *"Executive Leadership"*) rather than internal engineering jargon or shorthand.
4. **Authentic Imagery & Visual Proof**: Always prioritize authentic client photos, real venue and product images, and verified case studies over generic stock art or unreviewed placeholder graphics.

---

## 9. Mandatory Brand Endorsement Strip Docking ("Powered by Hiranyam AI Labs") (P0 Standard)

1. **Ubiquitous Brand Endorsement Docking**:
   - Every user interface (mobile screen, tablet master-detail layout, web portal, landing page, e-commerce store, and administrative dashboard) MUST permanently anchor the brand endorsement strip:
     `"Powered by Hiranyam AI Labs"` with the AI sparkle icon (`✦` / `Icons.auto_awesome`).
2. **Visual Hierarchy & Styling Rules**:
   - Background: Solid white/elevated neutral surface with a 1px top border delimiter (`#E2E0EE`) and ambient elevation.
   - Text & Icon: Royal Indigo text (`#393185`, 11.5sp / 11.5px, SemiBold 600) and Saffron Orange sparkle (`#EA892F`, 13px).
   - Interaction Safety: Docked persistently without covering form action buttons, fab buttons, or pagination controls.
3. **Reference**: See detailed technical patterns in `standards/brand-endorsement-standards.md`.

---

## 10. Mandatory Customer-Facing Form & Control Design Standard (Zero-Default-HTML Widgets Mandate — P0 Rule 28)

Every web application, customer portal, intake form, and administrative dashboard engineered across Hiranyam AI Labs MUST strictly enforce the **Executive Form Controls & Zero-Default-HTML Mandate**:

1. **Strict Prohibition of Raw Browser Defaults**:
   - Under NO circumstances may any application render unstyled, raw browser default form inputs (`<input>`, `<select>`, `<textarea>`, `<button>`).
   - Every input, select dropdown, and textarea MUST use custom, luxury design system tokens matching the highest product-company standards (Linear, Stripe, Apple, Radix UI).
2. **Standard Form Input Dimensions & Spacing Tokens**:
   - **Height**: Standard single-line inputs and dropdowns MUST be between **48px and 52px** (never tiny 20px–28px default boxes).
   - **Internal Padding**: Generous horizontal padding (`16px–18px`) and vertical padding (`12px–14px`) so text never touches or crowds borders.
   - **Border & Surface**: `1.5px solid #E2E8F0` on elevated crisp white `#FFFFFF` (or soft porcelain `#F8FAFC`). Soft rounded corners (`border-radius: 10px–12px`).
   - **Interactive Focus Ring**: On focus, inputs MUST display a soft ambient focus ring (`border-color: #393185; box-shadow: 0 0 0 4px rgba(57, 49, 133, 0.12); outline: none;`).
3. **Custom Select Dropdown Controls**:
   - Native `<select>` elements MUST disable default browser chrome via `appearance: none; -webkit-appearance: none;`.
   - Provide an inlined SVG chevron icon docked at `right: 16px` with generous right padding (`padding-right: 44px`) so text never overlaps the arrow.
   - Background MUST be crisp white (`#FFFFFF`) with font-weight 500.
4. **Resilient Vector SVG Icons (Zero CDN Font Dependency)**:
   - Critical icons (form prefixes, badges, brand emblems, status indicators, dropzones) MUST NEVER rely solely on external CDN font stylesheets (e.g. FontAwesome CDN) which can be blocked by ad-blockers, network latency, or firewalls, causing broken fallback glyphs (such as 'H', empty squares, or raw text).
   - Embed lightweight, high-fidelity **inline SVGs** (or bundled SVG symbols) so all icons render with 100% mathematical fidelity on every device and browser offline or online.
5. **Non-Technical Customer Hierarchy & Microcopy**:
   - Non-technical customers must never be overwhelmed with visual clutter, technical abbreviations, or cramped forms.
   - **Field Spacing**: Maintain a minimum 20px–24px vertical separation between form fields.
   - **Labels**: Bold, readable labels (13.5px, font-weight 600, color `#1E293B`) paired with a subtle semantic icon.
   - **Microcopy & Hints**: Friendly, reassuring helper text underneath inputs in `#64748B` explaining expected inputs in plain business language.
6. **Multi-Format Dropzone Architecture**:
   - File upload dropzones MUST feature a generous tactile area with soft dashed border (`2px dashed #CBD5E1`), 16px border-radius, clean cloud upload vector icon, clear primary callout ("Drop files here, or click to browse"), and distinct pill badges for supported file types (`PNG`, `JPG`, `PDF`, `DOCX`).

---

## 11. Mandatory Comprehensive Iconic Visual System, Background Textures & Persona-Tailored Themes (P0 Rule 29 / ADR-0026)

Every web application, client workspace, and portal engineered across Hiranyam AI Labs MUST provide a rich, multi-layered visual experience with **bespoke iconography, tactile background textures, and stakeholder persona-tailored themes**:

1. **Strict Prohibition of Bland Flat Canvases**:
   - Applications must NEVER render plain, flat, lifeless single-color backgrounds (e.g. raw `#FFFFFF` or flat `#F1F5F9`).
   - The canvas MUST incorporate subtle, high-resolution mathematical vector textures (e.g. geometric isometric grids, topographical contours, architectural guilloche lines, or fine dot-matrix patterns) layered over ambient radial mesh gradients.
   - Textures must remain subtle (`3%–7%` opacity) to ensure 100% legibility and WCAG AA contrast while delivering executive tactile depth.

2. **Persona-Specific & Domain-Tailored Visual Themes**:
   Every enterprise platform serves diverse stakeholders with distinct mental models and aesthetic preferences. The portal must dynamically adapt its background texture, accent tokens, and card styling based on the active persona or client workspace:
   - **Persona A: Wealth Management, Private Banking & High-Net-Worth Portfolios (e.g. Milind Ambekar Wealth)**:
     - *Texture*: Architectural geometric guilloche and fine financial valuation curve watermark (`bg-texture-wealth.svg`).
     - *Palette*: Deep Royal Indigo (`#393185`), Radiant Heritage Gold (`#D4AF37`), Ivory Pearl (`#FDFBF7`), hairline gold borders (`rgba(212, 175, 55, 0.25)`).
   - **Persona B: Real Estate, Land Development & Infrastructure (e.g. Hemkar Realty)**:
     - *Texture*: Demarcated topographical contour lines and coastal red-laterite micro-mesh (`bg-texture-realty.svg`).
     - *Palette*: Forest Emerald (`#059669`), Warm Amber Sand (`#D97706`), Velvet Porcelain (`#F6FAF7`), botanical green accents.
   - **Persona C: Enterprise Software Engineering & Control Plane (e.g. Hiranyam Labs Owner / Admin)**:
     - *Texture*: Technical fine-line isometric matrix and cybernetic circuit bus watermark (`bg-texture-engineering.svg`).
     - *Palette*: Midnight Slate (`#0F172A`), Cyber Cyan (`#0284C7`), Terminal Green (`#10B981`), monospace data telemetry chips.
   - **Persona D: Business Analysis & Client Success Operations (e.g. Ananya BA)**:
     - *Texture*: Soft generative dot-matrix mesh and floating workflow nodes (`bg-texture-creative.svg`).
     - *Palette*: Royal Violet (`#7C3AED`), Rose Blossom (`#F43F5E`), Radiant Lilac (`#FAF5FF`), high-clarity status tags.

3. **Comprehensive Bespoke Dual-Tone SVG Iconography System**:
   Every visual element MUST be paired with a crisp, domain-authentic vector icon:
   - **Zero Missing / Generic Icons**: Every requirement category (New Feature, Defect, Enhancement, Security Patch, Cloud DevOps, AI Tuning), file type (PDF, Word DOCX, Excel XLSX, Code ZIP, Images), workflow stage, and action button MUST feature a bespoke icon.
   - **Dual-Tone Geometry**: Built on a standardized 24×24 grid with 2px stroke weight, rounded stroke caps (`stroke-linecap="round"`), and subtle 12%–18% filled secondary geometric accents (`fill-opacity="0.12"`) matching the component's semantic color.
   - **Universal Scalability & Offline Resilience**: Icons must be bundled locally or inlined as pure SVG definitions, completely eliminating third-party CDN font dependencies.

4. **Tactile Glassmorphism Card Hierarchy**:
   - Cards must float gracefully over the textured background using modern frosted glassmorphism:
     `background: rgba(255, 255, 255, 0.94); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1.5px solid rgba(226, 232, 240, 0.9);`
   - Subtle ambient shadow: `box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 2px 8px -2px rgba(0, 0, 0, 0.02);`
   - Micro-hover transitions (`transform: translateY(-2px); box-shadow: 0 14px 34px -5px rgba(57, 49, 133, 0.08);`).

---

## 12. Compliance & Governance

Every new application, dashboard view, or client UI pull request must pass a UI/UX checklist verifying:
- [ ] Responsive behavior verified on Mobile (375px) and Desktop (1440px).
- [ ] Zero raw unstyled browser inputs, selects, or textareas (Executive Form Controls Mandate).
- [ ] Custom SVG dropdown arrows and 48px–52px input heights applied.
- [ ] Zero broken icons (inline SVGs or verified reliable assets used).
- [ ] Architectural textured background applied (zero flat blank canvases).
- [ ] Persona-tailored theme adaptation verified for target user domains.
- [ ] Comprehensive dual-tone SVG icons assigned to all requirement types, file formats, and workflow states.
- [ ] WCAG 2.1 AA color contrast verified.
- [ ] Meaningful content audit passed (zero robotic numbered headings like "Item 1", zero placeholder filler).
- [ ] Presentable semantic navigation bar titles verified.
- [ ] Persistent brand endorsement strip ("Powered by Hiranyam AI Labs") docked and verified across all views.
- [ ] Empty and loading states implemented.
- [ ] Destructive actions guarded with confirmation modals.
- [ ] Micro-interactions, transitions, and hover states applied.


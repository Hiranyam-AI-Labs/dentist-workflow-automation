# SPEC-ENG-LUXURY-WEB-001: Universal Autonomous Luxury AI-Generated Web Factory Standard

> **Standard ID:** SPEC-ENG-LUXURY-WEB-001 / ADR-0020  
> **Status:** APPROVED & MANDATORY (P0 Standard)  
> **Applies to:** All AI models, agents, and engineers building websites across Hiranyam AI Labs.

---

## 1. Executive Mandate: One-Shot Luxury Web Execution

Every website, web portal, corporate presence, and landing platform generated across Hiranyam AI Labs—regardless of domain or business vertical—MUST be engineered to an **ultra-luxury, world-class standard in ONE SHOT**. 

Clients and developers must never need to re-prompt for:
- Image quality or photorealism
- Luxury typography and editorial framing
- Responsive layout architecture and mobile-first compliance
- Interactive filtering, search, and WhatsApp lead capture
- Video streaming offloading

Whether the target business is a **doctor/clinic**, **pharmacy/medical store**, **real estate developer/broker**, **architectural firm**, **law practice**, or **financial consultancy**, the autonomous agent must deliver an experience rivaling **Sotheby's International Realty**, **Aman Resorts**, **Apple**, and **Christie's International Real Estate**.

---

## 2. Core Architectural Principles

### 2.1 Mandatory Domain-Specific Photorealistic AI Imagery
1. **Zero Generic Stock Photos / Zero Placeholders:** Never use low-resolution images, robotic stock photography, or empty colored boxes.
2. **Autonomous Image Generation:** The agent MUST autonomously invoke `generate_image` to produce 8–12 ultra-high-resolution, photorealistic, cinematic visuals capturing the authentic essence of the business:
   - **Real Estate / Land:** Dramatic aerial drone perspectives, demarcated golden boundary lines, authentic soil textures (e.g. Konkan red laterite), oceanfront bluffs, fruit orchards, highway corridors.
   - **Doctors / Hospitals:** State-of-the-art sterile surgical suites, warm patient consultation lounges, high-tech diagnostic radiology equipment, serene recovery suites.
   - **Pharmacies / Medical Stores:** Precision apothecary shelving, climate-controlled temperature monitors, organized pharmaceutical aisles, digital verification terminals.
   - **Builders / Architects:** Structural steel and monolithic concrete foundations, floor-to-ceiling glass pavilions, landscape gardens, masterplan renders.

### 2.2 Adaptive Luxury Color Token Systems
Websites must employ a cohesive two-tone luxury palette:
- **Primary Brand Tone:** A deep, commanding jewel tone or corporate shade:
  - *Cadbury Dairy Milk & P.N. Gadgil Jewellers Royal Purple* (`#2C0854` / `#3C1378`) for luxury land, fine jewelry, and royal heritage.
  - *Clinical Deep Teal & Emerald* (`#0A4D40` / `#0F6B54`) for medical, dental, and wellness.
  - *Midnight Sapphire & Indigo* (`#0D1B2A` / `#1B263B`) for institutional corporate, legal, and banking.
- **Radiant Metallic Accent:** P.N. Gadgil Radiant Heritage Gold (`#D4AF37` / `#F3D87E`) or Platinum Silver (`#E2E8F0`).
- **Surface Foundations:** Velvet lavender-white (`#F9F7FC`), ivory (`#FBFBF9`), or pure crisp white (`#FFFFFF`) with ultra-delicate 1px borders.

### 2.3 Required Component Topology & Interactive Experience
Every luxury website MUST implement these standard modular sections:
1. **Navbar:** Fixed/sticky glassmorphism header with crisp brand emblem, direct phone hotline (`tel:`), VIP WhatsApp concierge trigger, and smooth anchor navigation.
2. **LuxuryHero:** Full-viewport immersive hero featuring the master AI visual, bold editorial serif headlines, trust badges, key metric counters (e.g. 100% Clear Titles, 50+ Verified Parcels), and primary consultation CTAs.
3. **EditorialStory:** Architectural narrative detailing market dynamics, infrastructure catalysts, scientific foundations, or business pedigree.
4. **CategoryGrid:** Interactive domain classification cards (e.g. Single Plots, NA Sanctioned, Agricultural Orchards, Industrial Corridors) with click-to-filter capabilities.
5. **InventoryCatalog / ServicesCatalog:** Dynamic catalog with instant search, category tabs, geographic/attribute filters, technical specs, and 1-click WhatsApp inquiry.
6. **Infrastructure / FacilitiesDeepDive:** Photorealistic visual proof of connectivity, logistics, or equipment.
7. **FiduciaryTrust / WhyChooseUs:** Core pillars of credibility (legal certifications, direct mandates, physical ground teams, regulatory compliance).
8. **YouTubeVideoModal:** High-definition video streaming via YouTube player modals, adhering to the FOSS Media Asset Strategy (never burden servers with heavy MP4 binaries).
9. **EnquiryModal:** Royal-styled consultation modal capturing user intent, contact info, and automatically compiling a rich, pre-filled WhatsApp message routed directly to the sales desk.
10. **WhatsAppConcierge:** Floating interactive button with subtle pulse animation and live desk status.
11. **BrandEndorsementBadge:** Persistent, docked bottom brand strip: `"Powered by Hiranyam AI Labs"` (P0 Rule 17).

---

## 3. Technology Stack & Deployment Standards
- **Framework:** Next.js (App Router) or Vite + React with Tailwind CSS.
- **Icons:** Lucide React.
- **Animations:** CSS transitions & subtle transforms (hardware-accelerated, zero jank).
- **Responsive Universality:** 100% device-agnostic (Mobile Portrait `360px` → Mobile Landscape → Tablet `768px` → Desktop `1280px+`). Zero horizontal overflow (`overflow-x: hidden`).
- **Server Deployment:** Multi-stage Dockerfile with standalone Node.js runner or static Nginx container, consuming `< 64MB` RAM on Hostinger VPS.

---

## 4. Priority Zero Image & Graphic Assets Mandate (P0 Rule 31 / ADR-0028)
- **Zero-HTML-for-Graphics Ban:** Never create HTML/CSS pages to screenshot, cut, or crop them as images, pamphlets, flyers, or banners.
- **Native AI Image Generation First:** All imagery and graphic visual assets must be generated directly using native AI image generation (`generate_image`, Imagen 3, Nano Banana prompt architecture).
- **Reference:** `standards/ai-image-and-visual-design-standards.md` and `openspec/decisions/ADR-0028-native-ai-image-generation-over-html-standard.md`.


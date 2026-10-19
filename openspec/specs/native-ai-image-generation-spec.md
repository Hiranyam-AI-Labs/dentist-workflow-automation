# SPEC-ENG-AI-IMG-001: Native AI Image & Visual Asset Generation Specification

- **Specification Code:** `SPEC-ENG-AI-IMG-001`
- **Associated ADR:** `ADR-0028`
- **Rule Classification:** Priority Zero (P0 Rule 31)
- **Status:** Approved & Enforced
- **Effective Date:** 2026-10-12

---

## 1. Overview & Purpose

This specification defines the mandatory technical standard for generating visual assets, design artwork, pamphlets, flyers, posters, visiting cards, social graphics, and banners across all Hiranyam AI Labs software ecosystems and client projects.

It strictly outlaws the practice of rendering HTML/CSS mockups and screenshotting/cropping them to produce images, establishing native AI image generation tools and prompt intelligence as the single authoritative pipeline.

---

## 2. Prohibited Practices (P0 Anti-Patterns)

| Anti-Pattern | Description | Status |
| :--- | :--- | :--- |
| **HTML-to-Image Screenshotting** | Writing an `.html` file with CSS and taking a screenshot or cropping it as a `.png`/`.jpg`. | **STRICTLY FORBIDDEN (P0 DEFECT)** |
| **Puppeteer / Playwright Canvas Snipping** | Using headless browser screenshotting to convert HTML mockups into graphic images. | **STRICTLY FORBIDDEN (P0 DEFECT)** |
| **Boxy CSS Cards as "Graphics"** | Using border-radii, CSS box-shadows, and HTML fonts to simulate physical pamphlets or business cards. | **STRICTLY FORBIDDEN (P0 DEFECT)** |
| **Low-Resolution Raster Stock** | Downloading low-DPI generic stock photos or gray placeholder boxes. | **STRICTLY FORBIDDEN (P0 DEFECT)** |

---

## 3. Approved AI Image Generation Pipeline

### 3.1 Primary Tooling & Models
1. **Primary Tool:** `generate_image` (Antigravity Native Tool) invoking Google Imagen 3 / Gemini Vision generation pipelines.
2. **Generative Intelligence Architecture:** Nano Banana prompt structures, detailed sensory descriptors, photographic parameters, tactile materiality, and domain-authentic color harmonies.
3. **Storage Location:** All generated graphics must be saved to `assets/images/` (or dedicated client subdirectories such as `assets/images/brand/`, `assets/images/showcase/`).

### 3.2 Aspect Ratio Mapping
Agents must declare the appropriate `AspectRatio` parameter:
- `1:1`: Brand emblems, circular stamps, avatar headshots, square social media creatives.
- `3:2` or `16:9`: Landscape banners, desktop hero backgrounds, executive presentation slides, billboards.
- `2:3` or `9:16`: Vertical posters, mobile pamphlets, event flyers, vertical visiting cards, Instagram stories/reels covers.
- `3:4` or `4:3`: Editorial magazine covers, portrait showcases, structured product brochures.

### 3.3 Prompt Engineering Standards (Nano Banana Framework)
Every image generation prompt MUST include:
1. **Subject & Domain Context:** Clearly defined central subject tailored to the business domain (e.g. Ayurvedic apothecary, luxury real estate estate, CA wealth cockpit, precision engineering).
2. **Materiality & Tactility:** Specific physical textures (e.g., 350 GSM matte cotton paper, embossed gold leaf foil, subtle metallic sheen, frosted glass, deep velvet texture).
3. **Lighting & Atmosphere:** Cinematic lighting directives (e.g., 85mm portrait lens, f/1.8 aperture, soft directional studio lighting, warm rim light, volumetric ambience, 8K ultra-detailed).
4. **Color Palette Tokens:** Explicit hex/color harmony (e.g., Royal Indigo `#393185`, Saffron Orange `#EA892F`, Radiant Gold `#D4AF37`, Clinical Deep Teal `#0F4C5C`).
5. **Text-Free Clean Artwork:** Explicitly prompt to generate visual artwork without garbled pseudo-text; typographical overlays must be added through precision vector engines if needed.

---

## 4. Print-Ready Asset Hybrid Pipeline

For physical print collaterals (Visiting Cards, Tri-fold Brochures, Certificates):
1. **Step 1 (AI Art Generation):** Generate background artwork, emblems, borders, and textures via `generate_image`.
2. **Step 2 (Vector Layout Composition):** Use Python `ReportLab` to load the generated AI artwork as the background canvas.
3. **Step 3 (Vector Typography):** Overlay razor-sharp TrueType typography for names, phone numbers, addresses, and licenses.
4. **Step 4 (Vector QR Code):** Overlay mathematically generated vector QR codes with high error correction (Level H).
5. **Step 5 (Dual Delivery):** Export print-ready 300+ DPI vector PDF and high-res JPEG/PNG proof.

---

## 5. Enforcement & Self-Correction

Any agent reviewing code or inspecting deliverables that identifies an HTML-to-image screenshot must immediately:
1. Flag a P0 violation.
2. Delete the pseudo-image and temporary HTML screenshot script.
3. Invoke `generate_image` with proper generative prompt parameters.
4. Verify the generated high-resolution asset before handoff.

# AI Image & Visual Asset Generation Standard (Priority Zero Mandate)

> **Universal Standard for Generating Graphics, Pamphlets, Visiting Cards, Posters, Banners, and Visual Media across Hiranyam AI Labs and Client Workspaces.**
> **Classification:** Priority Zero (P0 Rule 31 / ADR-0028 / SPEC-ENG-AI-IMG-001)

---

## 1. Core Mandate: Native AI Image Intelligence First

When creating visual design collaterals, graphics, banners, pamphlets, flyers, posters, visiting cards, hero illustrations, or brand artwork across any project:

```text
               ┌────────────────────────────────────────────────────────┐
               │              GRAPHIC / IMAGE DESIGN REQUEST             │
               └──────────────────────────┬─────────────────────────────┘
                                          │
            ┌─────────────────────────────┴─────────────────────────────┐
            ▼                                                           ▼
   [ STRICTLY FORBIDDEN ]                                     [ MANDATORY STANDARD ]
   - Writing HTML/CSS pages                                   - Use Native AI Image Intelligence
   - Taking browser screenshots                               - Invoke `generate_image` / Imagen 3
   - Cropping/cutting HTML divs                               - Nano Banana prompt architecture
   - Using Puppeteer to export PNG                            - High-resolution textures & lighting
   - Flat, boxy CSS card layouts                              - Proper aspect ratios (1:1, 2:3, 16:9)
            │                                                           │
            ▼                                                           ▼
   ❌ P0 BUILD REJECTION                                      ✅ PRODUCTION-GRADE ARTWORK
```

---

## 2. Why HTML-to-Image Screenshotting is Strictly Outlawed

1. **Lack of Visual Depth:** HTML/CSS box models produce rigid lines and flat backgrounds. They cannot generate photographic depth of field, natural lighting, organic shadows, or fine material textures.
2. **Subpixel Anti-Aliasing Blur:** Screenshots taken from browsers are rendered for screen displays, resulting in fuzzy, blurry text and aliasing when scaled or printed.
3. **Misrepresentation of Generative AI:** Hiranyam AI Labs is an advanced AI engineering organization. Faking image design with HTML screenshots diminishes the brand and fails customer expectations.
4. **Print Incompatibility:** Professional print shops require high-resolution (300 DPI) uncompressed raster imagery or vector PDF files with proper bleed and crop marks. HTML screenshots fall apart in prepress checks.

---

## 3. Approved AI Image Generation Pipeline

### 3.1 Primary Native Tool
AI agents must call the native `generate_image` tool, powered by Google Imagen 3 and Gemini generative vision models.

```json
{
  "ImageName": "hiranyam_luxury_visiting_card_front",
  "Prompt": "Photorealistic luxury vertical business card on ultra-heavy 400 GSM matte cotton cardstock. Rich royal indigo (#393185) textured surface with subtle sacred geometry gold foil embossing. Centered intricate Sri Yantra and lotus emblem in radiant warm gold foil with raised tactile finish. Soft directional studio lighting, dramatic rim light, macro lens 85mm f/1.8, cinematic depth of field, 8k ultra-sharp detail, clean luxury aesthetic, no text.",
  "AspectRatio": "2:3"
}
```

### 3.2 The Nano Banana Prompt Engineering Framework
Every image prompt must be meticulously constructed with four distinct prompt layers:

1. **Layer 1: Scene & Subject Definition**
   - Precise subject description (e.g., "Executive visiting card resting on dark slate", "Ayurvedic wellness brochure front cover", "Luxury Konkan coastal development billboard").
2. **Layer 2: Materiality & Tactile Physics**
   - Tangible physical properties: "heavy cotton paper", "gold leaf foil stamping", "matte velvet lamination", "brushed brass", "subtle letterpress debossing".
3. **Layer 3: Lighting, Optics & Atmosphere**
   - Cinematic camera directives: "85mm macro lens", "f/1.8 shallow depth of field", "volumetric light beam", "studio softbox rim lighting", "photorealistic 8k render".
4. **Layer 4: Brand Color Tokens & Style Constraints**
   - Harmonious color hexes: Royal Indigo (`#393185`), Saffron Orange (`#EA892F`), Radiant Gold (`#D4AF37`), Clinical Teal (`#0F4C5C`).
   - Style negative guards: "clean background, zero blurry artifacts, no deformed elements, no pseudo-gibberish text".

---

## 4. Aspect Ratio Matrix

| Asset Type | Recommended Aspect Ratio | Use Case |
| :--- | :--- | :--- |
| **Brand Emblems & Logos** | `1:1` | Logos, seals, stamps, square social media profile badges |
| **Social Media Feed Posts** | `1:1` or `4:5` | Instagram/LinkedIn feed graphics |
| **Vertical Pamphlets & Flyers** | `2:3` or `9:16` | A5/A4 vertical flyers, WhatsApp status posters, event roll-ups |
| **Visiting Cards (Vertical)** | `2:3` | Modern luxury portrait visiting cards (3.5" x 2" proportion) |
| **Visiting Cards (Horizontal)** | `3:2` | Traditional landscape business cards |
| **Website Hero & Desktop Banners**| `16:9` or `3:2` | Full-width web banners, presentation title slides |
| **Editorial & Brochure Covers** | `3:4` | Annual reports, whitepaper covers, tri-fold panels |

---

## 5. Print Deliverables: The Hybrid Vector PDF Pipeline

When physical print manufacturing is required (business cards, corporate stationery, tri-fold pamphlets):

```text
[Step 1: Native AI Image Generation]
  - Generate high-res background art, textures, and gold foil emblems via `generate_image`
  - Output high-density master image in assets/images/
        │
        ▼
[Step 2: Python ReportLab Vector Composition]
  - Load the AI-generated master image as the full-bleed canvas background
  - Overlay crisp TrueType vector typography (names, designations, phone, email, address)
  - Generate and overlay mathematically perfect vector QR codes (Level H error correction)
        │
        ▼
[Step 3: Dual Output Export]
  - Print-Ready Vector PDF (300+ DPI equivalent, razor-sharp at any zoom level)
  - Ultra-High-Resolution Proof Image (PNG/JPEG)
```

**Never screenshot an HTML page to create the business card or pamphlet.**

---

## 6. Directory Allocation
All generated images must be placed in accordance with **ADR-0018 / P0 Rule 19**:
- Master image assets: `assets/images/` or `assets/images/designs/`
- Print PDF deliverables: `customer-handover/` or `distribution/`
- Scratch/temporary intermediate assets: `scratch/`

---

## 7. Compliance Verification Checklist
- [ ] No `.html` files were created to capture screenshots.
- [ ] No puppeteer, playwright, or headless browser scripts were used for graphics.
- [ ] `generate_image` was invoked directly with detailed Nano Banana prompt syntax.
- [ ] Proper aspect ratio was explicitly supplied.
- [ ] High-resolution asset is saved in `assets/images/`.
- [ ] For print assets, final deliverable is compiled via Python ReportLab vector PDF.

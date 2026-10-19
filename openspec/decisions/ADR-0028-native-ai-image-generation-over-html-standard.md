# ADR-0028: Universal Native AI Image & Visual Asset Generation Mandate (P0 Rule 31)

- **Status:** Approved & Non-Negotiable (Priority Zero / P0 Rule 31)
- **Date:** 2026-10-12
- **Deciders:** Principal Architect, Lead Design Technologist, AI Systems Orchestrator
- **Scope:** Universal across all 500+ client projects, subagents, and automated developer tooling
- **Specification:** `SPEC-ENG-AI-IMG-001`
- **Standard Reference:** `standards/ai-image-and-visual-design-standards.md`

---

## 1. Context & The Defect Pattern

Across Hiranyam AI Labs and client enterprise projects, visual assets are constantly developed:
- Marketing pamphlets, flyers, brochures, and trifolds
- Executive visiting cards and stationery
- Social media creatives, banners, and billboards
- Hero imagery, product showcases, and luxury web textures
- Event posters, identity badges, and certificates

### The Anti-Pattern (Strictly Prohibited Defect)
In recent sessions, automated agents developed a severe shortcut anti-pattern:
Instead of generating authentic graphics and images using generative AI tools, agents wrote basic HTML/CSS files, rendered them in a browser, and captured screenshots or cropped/cut the HTML canvas into `.jpg` or `.png` files.

### Why This Is Fundamentally Defective
1. **Flat, Stiff & Boxy Visuals:** HTML/CSS box models cannot replicate artistic lighting, photographic depth of field, tactile paper grain, realistic metallic foils, or organic textures.
2. **Blurry & Pixelated Artifacts:** Browser screenshots suffer from screen-resolution rasterization, subpixel anti-aliasing blur, and poor edge definitions.
3. **Failure of Generative AI Core Identity:** Clients hire Hiranyam AI Labs for state-of-the-art generative intelligence. Delivering an HTML screenshot under the guise of an "image" or "graphic design" is an unacceptable failure of craft.
4. **Unusable for High-DPI Print:** Professional print manufacturing requires high-resolution raster masters (300+ DPI) or genuine vector layouts (PDF with embedded TrueType fonts and vector QR codes). Screenshotting HTML produces jagged, unprintable output.

---

## 2. Decision: Priority Zero (P0 Rule 31) Mandate

We mandate **P0 Rule 31: Universal Native AI Image & Visual Asset Generation Mandate**:

### 1. Zero-HTML-for-Graphics Prohibition
- **NEVER** write HTML/CSS and screenshot, rasterize, cut, or crop it as an image, pamphlet, visiting card, or poster.
- Any pull request, script, or commit creating an image via HTML screenshotting is rejected immediately as a P0 violation.
- HTML is strictly reserved for live interactive web applications, portals, and dashboards.

### 2. Native AI Image Generation First (Nano Banana & Generative Intelligence)
- Every image, pamphlet, brochure, visiting card visual, flyer, poster, banner, and design asset MUST be synthesized directly using native AI image generation intelligence.
- Agents must utilize native tools (such as `generate_image`, Google Imagen, Gemini visual generation, Nano Banana prompt architecture, FLUX, and high-density generative pipelines).
- Prompts must specify:
  - Exact aspect ratio (`1:1`, `3:2`, `16:9`, `2:3`, `9:16`).
  - Photographic and artistic parameters (85mm lens, f/1.8, soft bokeh, volumetric cinematic lighting, photorealism).
  - Tactile physical materials (e.g. 350 GSM cotton cardstock, brushed gold foil stamping, deep royal indigo velvet matte finish, embossed letterpress).
  - Brand-specific luxury color palettes (Hiranyam Royal Indigo `#393185`, Saffron Orange `#EA892F`, Radiant Gold `#D4AF37`, or domain-specific tokens).
  - Zero pseudo-gibberish text in generated image fields.

### 3. Print-Ready Vector PDF Standard
- When physical print assets (e.g., business cards, brochures) require vector-sharp text, legal disclaimers, or scannable QR codes:
  1. The luxury visual background, textures, emblems, and artistic graphics MUST be generated via native AI image generation first.
  2. The final print deliverable is composed using Python ReportLab or a vector graphics engine:
     - Embedding the high-resolution AI-generated art as the background layer.
     - Drawing calibrated TrueType vector typography on top.
     - Drawing mathematical vector QR codes directly.
  3. Output both print-ready vector PDF and high-resolution preview image.
  4. Never use HTML screenshotting.

---

## 3. Consequences

### Positive
- **World-Class Visual Quality:** Deliverables feature cinematic lighting, rich textures, and breathtaking AI visual craft.
- **Client Trust & Brand Alignment:** Demonstrates true frontier generative AI capabilities.
- **Production Prepress Compliance:** Print files meet professional 300+ DPI commercial printing standards.

### Negative / Trade-offs
- Requires thoughtful, descriptive prompt engineering rather than trivial HTML scaffolding. (Addressed by standardized prompt blueprints).

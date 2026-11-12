# Master Presentation Factory & Client Domain Design Standards
## Document ID: SPEC-PRESENTATION-FACTORY-001 / ADR-0024
**Applies To:** All client presentation decks, slide decks, and executive showcases across Hiranyam AI Labs.

---

## 1. Core Principle: Client Domain Theme Sovereignty (Anti-Monolith Mandate)

1. **Client Isolation from Hiranyam Brand Colors:**
   - Presentations engineered for clients (e.g. Shikha Tiwari, Aarogyam, Alohaa, DG Online, Hemkar Realty) **MUST NEVER default to Hiranyam AI Labs corporate colors** (Royal Indigo `#393185`, dark purple, or dark navy) unless the client specifically requests them.
   - The only Hiranyam branding permitted is the unobtrusive, anchored footer endorsement: `"✦ Powered by Hiranyam AI Labs"` (P0 Rule 17).
2. **Domain-Specific Color Theory:**
   - **Vedic Astrology, Numerology & Vastu:** Serene pearlescent ivory, warm morning sunlight gold, subtle airy sky-blue, clean white cards, deep slate charcoal text, and auspicious saffron/amber accents.
   - **Ayurveda & Holistic Wellness:** Fresh botanical sage green, mint platinum, warm herbal cream, earthy terracotta accents.
   - **Healthcare, Clinics & Dental:** Clinical crisp white, sterile cyan, deep ocean teal, calm ice-blue.
   - **Chartered Accountants, Tax & Legal:** High-contrast crisp white, institutional slate, deep navy accents, authoritative charcoal.
   - **Luxury Real Estate & Infrastructure:** Cream alabaster, warm champagne gold, deep emerald or warm taupe.

---

## 2. Google & OpenAI Inspired Soothing Light-Theme Architecture

All presentation slides must be **soothing for the eyes**, **uncluttered**, and **professional**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Background Canvas                               │
│  Bright, airy, soothing textured backdrop (Soft White, Pearlescent      │
│  Ivory, subtle morning gold rays, faint pastel sky-blue gradients)     │
│                                                                        │
│   ┌───────────────────────────────┐  ┌───────────────────────────────┐ │
│   │       Pristine Card 1         │  │       Pristine Card 2         │ │
│   │  Surface: Pure White (#FFF)   │  │  Surface: Pure White (#FFF)   │ │
│   │  Text: Deep Slate (#0F172A)   │  │  Text: Deep Slate (#0F172A)   │ │
│   │  Border: Subtle (#E2E8F0)     │  │  Border: Subtle (#E2E8F0)     │ │
│   │  Shadow: Soft Diffuse (6-12px)│  │  Shadow: Soft Diffuse (6-12px)│ │
│   │  Accent: Soft Pastel Bubble   │  │  Accent: Soft Pastel Bubble   │ │
│   └───────────────────────────────┘  └───────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Specific UI/UX Rules:
1. **Never Use Dark Backgrounds on Text Containers:**
   - Dark boxes with dense text induce cognitive overload and eye fatigue on AV projectors.
   - Content containers must use crisp white (`#FFFFFF`) or frosted white (`rgba(255, 255, 255, 0.92)`).
2. **High-Contrast Deep Slate Typography:**
   - Headings: Deep Charcoal `#0F172A` (SemiBold / Bold 700/800).
   - Body & Bullet points: Deep Slate `#334155` (Regular / Medium 500).
   - Muted labels: Slate `#64748B`.
3. **Generous Whitespace & Breathable Layouts:**
   - Cards must maintain minimum 20px–28px internal padding.
   - Limit text per card to 2–3 concise bullet points with distinct icon bubbles.
4. **Soft Floating Drop Shadows:**
   - `box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04);`
5. **Punchline Ribbons:**
   - Light cream or soft sky-blue background (`#FEF3C7` / `#F0F9FF`) with 4px solid saffron or blue left border.

---

## 3. Mandatory Interactive Presenter Tooling
1. **10-Minute Live Countdown Timer:**
   - Integrated into top header with elapsed tracking, warning shifts at 8:00 (orange) and 9:30 (red alert).
2. **Word-for-Word Presenter Notes Drawer:**
   - Activated via `N` key or button, including Web Speech API rehearsal prompter.
3. **Thumbnail Overview Grid:**
   - Activated via `O` key for instant slide jumping.
4. **Device & AV Projector Universality:**
   - Fullscreen via `F`, keyboard navigation (`←`/`→`/`Space`), and touch swipe for mobile/tablet.

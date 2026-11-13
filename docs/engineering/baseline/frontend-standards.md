# Frontend & Web Application Standards — Hiranyam AI Ecosystem

> **Standards for frontend engineering, directory structures, responsive UI design, brand endorsement, and static asset allocation.**

---

## 1. Directory Structure & File Allocation Standard (P0 Rule 19 / ADR-0018)
Frontend applications must strictly allocate assets into standardized subdirectories:

```text
├── assets/                       # Or public/ in frameworks like Next.js / Vite
│   ├── images/                   # PNG, JPG, WebP, SVG, icons, favicons (NO images in root)
│   ├── css/                      # Custom stylesheets, component CSS, theme tokens
│   ├── js/                       # Client-side scripts, utilities, interaction controllers
│   ├── vendor/                   # Third-party vendor assets
│   │   └── bootstrap/            # Bootstrap CSS/JS distributions (if applicable)
│   └── fonts/                    # Custom typography font files
├── templates/                    # Or views/ or apps/web/
│   ├── layouts/                  # Base page layouts
│   └── partials/                 # Reusable components and modals
```

- **Strict Root Cleanliness**: Zero loose `.html`, `.css`, `.js`, `.jpg`, `.jpeg`, or `.png` files in the repository root directory (exception: root `index.html` for single-page static sites that explicitly use root-level web server hosting).

---

## 2. Universal Brand Endorsement Strip Mandate (P0 Rule 17)
Every web portal, customer-facing landing page, client dashboard, e-commerce storefront, and presentation shell MUST permanently feature the anchored footer strip:
- **Text**: `"Powered by Hiranyam AI Labs"`
- **Icon**: AI sparkle icon (`✦` / SVG / `Icons.auto_awesome`) in Saffron Orange (`#EA892F`).
- **Typography**: Royal Indigo (`#393185`), font-weight 600, 11.5px, letter-spacing 0.35px.
- **Surface**: Docked bottom footer (`position: fixed; bottom: 0; z-index: 9999;`) with 1px top border delimiter (`#E2E0EE`), white background (`#FFFFFF`), and safe-area inset bottom padding (`env(safe-area-inset-bottom)`).
- **Ubiquity**: Visible across unauthenticated, authenticated, modal, and full-screen views.

---

## 3. Responsive UI/UX & Mobile-First Universality (P0 Rule 6 & 9)
- **Mobile-First Breakpoints**: Ensure seamless fluid rendering across 360px, 480px, 768px, 1024px, 1280px, and 4K displays.
- **Zero RenderFlex Overflow**: Unbounded text inside horizontal containers is strictly prohibited. Multi-column grids must automatically collapse to single vertical columns on viewports `<= 768px`.
- **Touch Ergonomics**: All interactive buttons, cards, and input controls must maintain a minimum touch target size of 44x44px.

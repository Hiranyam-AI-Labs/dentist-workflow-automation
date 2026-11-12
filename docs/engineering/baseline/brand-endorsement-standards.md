# Universal Brand Endorsement & Footer Standards

> **Authoritative Engineering & Branding Standard across all Hiranyam AI Labs Projects (Mobile, Tablet, Web, E-Commerce, Dashboards, Presentation Decks & Software Bundles).**
> **Heritage & Origin**: Established in BBNG Parivartan 2027 and Milind Ambekar HNI Wealth Platform, mandated universally across all client & tenant codebases.

---

## 1. The Core Mandate (P0 Rule 16)

Every single software deliverable, bundle, application, website, e-commerce storefront, admin dashboard, presentation shell, or digital portal engineered or released under **Hiranyam AI Labs** MUST permanently and persistently feature an anchored brand endorsement strip at the bottom of the viewport:

$$\text{Footer Text: } \mathbf{\text{"Powered by Hiranyam AI Labs"}}$$

### Ubiquitous Display Contract
This strip is non-negotiable and must never be hidden, suppressed, or replaced:
1. **Unauthenticated States**: Login screens, OTP verification screens, onboarding wizards, password resets.
2. **Authenticated States**: Home dashboards, product catalogs, shopping carts, checkout flows, user profiles, settings.
3. **Internal Sub-Routes & Screens**: Detail views, filter sheets, table listings, transaction ledgers, analytics dashboards.
4. **Modal & Dialog Overlays**: The root shell must keep the badge docked underneath or within the root builder hierarchy.
5. **Logged-Out & Error States**: 404 pages, session expiration screens, maintenance pages.

---

## 2. Visual & Styling Specification

The brand strip must strictly adhere to the following design tokens and visual hierarchy:

| Token / Property | Specification | Value / Hex Code |
| :--- | :--- | :--- |
| **Primary Label** | Exact brand string | `"Powered by Hiranyam AI Labs"` |
| **Sparkle Icon** | AI Sparkle Icon | `Icons.auto_awesome` (Flutter) / `✦` SVG / Unicode |
| **Icon Color** | Signature Saffron Orange | `#EA892F` |
| **Icon Size** | Compact, non-intrusive | `13.0dp` / `13px` |
| **Text Typography** | Font Family & Weight | `Poppins` or `Roboto`, `FontWeight.w600` (SemiBold) |
| **Text Size** | Discreet, executive scale | `11.5sp` / `11.5px` |
| **Text Color** | Signature Royal Indigo | `#393185` |
| **Letter Spacing** | Professional kerning | `0.35px` |
| **Surface Color** | Elevated crisp white | `#FFFFFF` |
| **Top Border** | Crisp delimiter line | `1.0px solid #E2E0EE` (Subtle Lavender-Gray) |
| **Ambient Shadow** | Soft upward elevation | `rgba(0, 0, 0, 0.04)`, `blurRadius: 4.0`, `offset: (0, -2)` |
| **Padding** | Responsive Edge Insets | Top: `6px`, Bottom: `max(6px, systemSafeAreaBottom)`, Left/Right: `16px` |

---

## 3. Platform Architectural Implementation Patterns

### 3.1 Flutter Cross-Platform Architecture (`MaterialApp.builder`)
In Flutter applications (mobile, tablet, desktop, or web), never manually add the badge widget to every individual view scaffold. Inject it globally into the root `MaterialApp.builder`:

```dart
// lib/shared/widgets/hiranyam_sponsor_badge.dart
import 'package:flutter/material.dart';

class HiranyamSponsorBadge extends StatelessWidget {
  const HiranyamSponsorBadge({super.key});

  @override
  Widget build(BuildContext context) {
    final double bottomInset = MediaQuery.of(context).padding.bottom;
    final double computedBottomPadding = bottomInset > 0 ? bottomInset : 6.0;

    return Material(
      color: Colors.white,
      child: Container(
        width: double.infinity,
        padding: EdgeInsets.only(
          top: 6.0,
          bottom: computedBottomPadding,
          left: 16.0,
          right: 16.0,
        ),
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(
            top: BorderSide(
              color: Color(0xFFE2E0EE),
              width: 1.0,
            ),
          ),
          boxShadow: [
            BoxShadow(
              color: Color(0x0A000000),
              blurRadius: 4.0,
              offset: Offset(0, -2),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: const [
            Icon(
              Icons.auto_awesome,
              size: 13.0,
              color: Color(0xFFEA892F), // Saffron Orange
            ),
            SizedBox(width: 6.0),
            Text(
              'Powered by Hiranyam AI Labs',
              style: TextStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.w600,
                color: Color(0xFF393185), // Royal Indigo
                letterSpacing: 0.35,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// lib/main.dart
MaterialApp(
  title: 'Client Application',
  builder: (context, child) {
    return Column(
      children: [
        Expanded(
          child: child ?? const SizedBox.shrink(),
        ),
        const HiranyamSponsorBadge(),
      ],
    );
  },
  home: const RootScreen(),
);
```

### 3.2 Native Android (Kotlin & Jetpack Compose)
In Jetpack Compose, anchor the badge inside the root `Scaffold` or root `Column`:

```kotlin
@Composable
fun HiranyamSponsorBadge() {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(elevation = 2.dp),
        color = Color.White
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .navigationBarsPadding()
                .padding(vertical = 6.dp, horizontal = 16.dp),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.AutoAwesome,
                contentDescription = null,
                tint = Color(0xFFEA892F),
                modifier = Modifier.size(13.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = "Powered by Hiranyam AI Labs",
                color = Color(0xFF393185),
                fontSize = 11.5.sp,
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 0.35.sp
            )
        }
    }
}
```

### 3.3 Web, Portals & E-Commerce Storefronts (HTML5, Tailwind, Next.js, React, Vue)
For all web applications, landing pages, client dashboards, and e-commerce stores:

```html
<!-- Fixed or sticky bottom brand endorsement strip -->
<footer class="hiranyam-brand-strip">
  <span class="sparkle-icon">✦</span>
  <span>Powered by Hiranyam AI Labs</span>
</footer>
```

```css
/* Universal CSS definition */
.hiranyam-brand-strip {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  background: #ffffff;
  border-top: 1px solid #e2e0ee;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: #393185;
  letter-spacing: 0.35px;
  z-index: 9999;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.hiranyam-brand-strip .sparkle-icon {
  color: #ea892f;
  font-size: 13px;
  line-height: 1;
}

/* Ensure document container has padding-bottom to prevent content clipping */
body {
  padding-bottom: calc(36px + env(safe-area-inset-bottom, 0px));
}
```

---

## 4. Compliance Checklist

Before any pull request, APK/IPA build, web deployment, or client handover is certified:
- [ ] Brand strip is present and permanently docked at the bottom of the viewport.
- [ ] Text strictly reads `"Powered by Hiranyam AI Labs"`.
- [ ] AI Sparkle icon is rendered in Saffron Orange (`#EA892F`).
- [ ] Text typography conforms to Royal Indigo (`#393185`) SemiBold.
- [ ] Safe area insets (edge-to-edge Android gesture bars, iOS home indicator) are dynamically respected.
- [ ] Bottom padding prevents the strip from obscuring floating action buttons, submit buttons, or table pagination.
- [ ] Automated widget or DOM tests assert presence of `"Powered by Hiranyam AI Labs"`.

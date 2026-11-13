# Internationalization (i18n) Architecture Standard

> **Default multi-lingual architecture standard for all client web applications, mobile apps, presentations, and dashboards.**

---

## 1. Core Mandate: No Hardcoded User-Facing Text

All client-facing applications must be engineered with internationalization support from day one.
Hardcoding raw strings into UI components (React JSX, Thymeleaf HTML, Flutter widgets) is strictly prohibited for non-trivial applications.

### Primary Supported Languages:
- **English (`en`)** — Default global business language
- **Marathi (`mr`)** — Regional priority language
- **Hindi (`hi`)** — National priority language
- Additional regional or international languages added via simple JSON/YAML dictionary extension.

---

## 2. Standard Dictionary Structure

All localized strings are organized by semantic component scope in structured JSON dictionaries:

```text
/locales
  ├── en/
  │   ├── common.json
  │   ├── navigation.json
  │   └── home.json
  ├── mr/
  │   ├── common.json
  │   ├── navigation.json
  │   └── home.json
  └── hi/
      ├── common.json
      ├── navigation.json
      └── home.json
```

### Example `common.json`:
```json
{
  "buttons": {
    "submit": "Submit",
    "contact_us": "Contact Us",
    "book_appointment": "Book Appointment"
  },
  "labels": {
    "phone": "Phone Number",
    "email": "Email Address",
    "address": "Office Address"
  }
}
```

---

## 3. URL Routing & Preservation Standard

For multi-lingual web platforms (e.g. Next.js / Angular):
- Default language published at `/`
- Secondary languages published under language sub-paths: `/hi/`, `/mr/`
- Language selectors must preserve the current page route and query parameters (e.g. `/services` -> `/hi/services`).

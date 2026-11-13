# Reusable Component & Pattern Catalog Standard

> **Company-wide catalog of standardized architectural building blocks, workflow blueprints, UI components, and API patterns.**

---

## 1. Reusable Pattern Taxonomy

To eliminate redundant reinvention while preserving client repository isolation, the company maintains modular, reusable patterns categorized into five functional domains:

### 1.1 Inbound Lead Intake & Omnichannel Pipelines
- **WhatsApp Webhook Ingress:** Fast 200 OK acknowledgment, HMAC SHA-256 validation, payload normalization.
- **Spam & Intent Classification:** Rule-based heuristics followed by lightweight LLM intent categorization.
- **Lead Scoring & Routing:** Score computation (budget, timeframe, urgency) and CRM / email notification dispatch.

### 1.2 Conversational AI & Voice Agents
- **Prompt Asset Versioning:** Standardized Markdown/JSON prompt templates with temperature and model metadata.
- **ElevenLabs Voice Knowledge Base:** Structured FAQ and service catalog format for natural voice telephony.
- **Session Memory & Context Buffer:** Sliding window conversation memory stored in PostgreSQL JSONB tables.

### 1.3 Persistence & Database Blueprints
- **PostgreSQL Schema Isolation Template:** DDL patterns with UUID primary keys, audit timestamps (`created_at`, `updated_at`), soft-deletes, and JSONB payload columns.
- **Flyway / Drizzle Versioned Migration Patterns:** Forward-only migration scripts.

### 1.4 Web & Presentation Shells
- **Lite YouTube Embed Web Component:** Zero-initial-JS video player for fast load times and zero VPS video streaming load.
- **Responsive Deck Shell:** HTML5/CSS3/JavaScript mobile-responsive slide presentation engine.
- **Multi-Lingual (i18n) Switcher:** Page-preserving language dropdown supporting English, Marathi, and Hindi.

### 1.5 DevOps & Deployment Patterns
- **Hostinger VPS Zero-Downtime Start-First Update Script:** PowerShell deploy script using timestamped archive, remote docker build, and rolling update order.
- **Traefik Dynamic Route YAML:** Configuration templates for HTTPS edge routing and Let's Encrypt SSL certificates.

### 1.6 Brand Endorsement & Ubiquitous Docking Shells (`cmp-hiranyam-sponsor-badge`)
- **Flutter Global Sponsor Badge (`HiranyamSponsorBadge`):** Material 3 bottom-docked badge injected via `MaterialApp.builder` with automatic safe-area calculation, Saffron Orange sparkle icon (`#EA892F`), and Royal Indigo typography (`#393185`).
- **Web & E-Commerce Brand Strip (`hiranyam-brand-strip`):** Fixed bottom HTML/CSS/Tailwind strip with safe area inset support (`env(safe-area-inset-bottom)`) for persistent "Powered by Hiranyam AI Labs" attribution across all web deliverables.


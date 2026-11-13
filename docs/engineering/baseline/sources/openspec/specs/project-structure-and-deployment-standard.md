# OpenSpec Specification: Project Structure & Self-Contained Deployment Standard

- **Spec ID:** `SPEC-ENG-STRUCT-001`
- **Version:** `1.0.0`
- **Status:** Approved
- **Effective Date:** 2026-09-23

---

## 1. Scope & Objective
This specification defines the universal engineering standard for repository directory layout, asset allocation, and self-contained Hostinger deployment configuration across all projects managed under Hiranyam AI Labs.

---

## 2. Directory Hierarchy Standard

Every project workspace (`F:\Clients\<ClientName>`) must adhere to the following product-company grade folder hierarchy:

```text
<ClientName>/
├── assets/                       # Static media and design assets
│   ├── images/                   # PNG, JPG, WebP, SVG logos, banners, diagrams
│   ├── css/                      # Custom component styling, tokens, utility CSS
│   ├── js/                       # Client-side scripts, UI controllers
│   ├── vendor/                   # Third-party vendor dependencies (Bootstrap, etc.)
│   └── fonts/                    # Web typography fonts
├── apps/                         # Application modules (web, mobile, dashboard)
│   ├── web/                      # Web application root (or Next.js / React / HTML5)
│   └── mobile/                   # Flutter / Android native code
├── src/                          # Backend source code (if Java / Node / Python)
│   ├── main/java/...             # Java package hierarchy
│   ├── main/resources/...        # Java configurations and templates
│   └── test/java/...             # Test suites
├── database/                     # Database assets
│   ├── migrations/               # Forward-only SQL migrations (e.g. 001_initial_schema.sql)
│   ├── seeds/                    # Reproducible seed data
│   └── sql/                      # Utility queries and administrative scripts
├── workflows/                    # Automation workflow definitions
│   └── *.workflow.json           # n8n workflows
├── docs/                         # Internal and project documentation
│   ├── user/                     # End-user manuals, FAQ, button dictionaries
│   ├── developer/                # Architecture, schema dictionaries, node dictionaries
│   └── deployment/               # Deployment guides, rollback procedures
├── customer-handover/            # Clean client deliverables (PDF + Markdown, no secrets)
├── developer-handover/           # Technical engineering specs, architecture, schemas
├── openspec/                     # Living OpenSpec configuration
│   ├── master-spec.md            # System baseline
│   ├── project-context.md        # Domain context
│   ├── architecture.md           # Architecture design
│   ├── specs/                    # Detailed domain specifications
│   ├── changes/                  # Change proposals
│   └── decisions/                # ADRs
├── scripts/                      # Automation & deployment scripts
│   ├── deploy-hostinger.ps1      # Self-contained Hostinger deployment engine
│   └── ...                       # Build and testing scripts
├── .env.deployment.example       # Deployment environment template
├── .gitignore                    # Git ignore file
├── CLIENT_REQUIREMENTS_REGISTER.md # Client requirements & asset register
├── PROJECT_STATUS.md             # Active lifecycle status
├── CHANGELOG.md                  # Release change record
└── README.md                     # Project overview and quick start
```

---

## 3. Strict Rules on File Allocation

1. **Zero Loose Asset Files in Project Roots**:
   - Never place `.png`, `.jpg`, `.jpeg`, `.svg`, `.css`, or client `.js` files directly in the repository root directory.
   - All visual assets must be placed inside `assets/images/` (or `public/images/`).
   - All stylesheets must be placed inside `assets/css/` (or `public/css/`).
   - All scripts must be placed inside `assets/js/` (or `scripts/`).
2. **HTML Templates**:
   - HTML documents must reside inside `templates/`, `views/`, `apps/web/`, or `public/`.
   - The only exception is a root `index.html` for single-page static sites that explicitly use root-based static hosting.
3. **Database Scripts**:
   - All `.sql` files must reside inside `database/migrations/`, `database/seeds/`, or `database/sql/`. Never in the root directory.

---

## 4. Self-Contained Deployment Contract (ADR-0017)

Every deployable repository must feature its own self-contained Hostinger deployment pipeline:

### 4.1 Deployment Script (`scripts/deploy-hostinger.ps1`)
The script must:
1. Accept parameters with default values for local development:
   - `$HostName = "72.62.198.241"`
   - `$PublicHost = "<client-subdomain>.bjttvo.easypanel.host"`
   - `$IdentityFile = "$env:USERPROFILE\.ssh\dg_online_hostinger"`
   - `$Environment = "development"`
2. Detect the presence of `$IdentityFile`. If present, authenticate via SSH key.
3. If `$IdentityFile` is missing, fallback to `$env:HOSTINGER_SSH_PASSWORD`.
4. Accept command-line overrides or a local `.env.deployment` file for future production deployments (`$env:PROD_SSH_KEY`, production domain, production VPS IP).
5. **NEVER** reference or inspect sibling directories under `F:\Clients\<OtherClient>`.

### 4.2 Deployment Environment Template (`.env.deployment.example`)
Every deployable project must include:
```text
# Deployment Environment Configuration Template
HOSTINGER_HOST=72.62.198.241
HOSTINGER_PORT=22
HOSTINGER_USER=root
HOSTINGER_PUBLIC_DOMAIN=<client-subdomain>.bjttvo.easypanel.host
HOSTINGER_SSH_KEY_PATH=$USERPROFILE/.ssh/dg_online_hostinger
# Production Overrides:
# PROD_HOST=
# PROD_SSH_KEY=
# PROD_DOMAIN=
```

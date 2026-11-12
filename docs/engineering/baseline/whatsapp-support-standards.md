# Future WhatsApp-Driven Client Support Architecture

> **Architecture specification for autonomous, AI-driven client support, issue intake, diagnostic triage, and safe patch deployment via WhatsApp.**

---

## 1. System Architecture & Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Client as Authorized Client
    participant WA as WhatsApp Cloud API Gateway
    participant Router as Central Webhook Router
    participant DB as PostgreSQL (Identity & Sessions)
    participant AI as Gemini AI Support Orchestrator
    participant Repo as Child Client Repository
    participant Hostinger as Hostinger VPS (EasyPanel/Traefik)

    Client->>WA: "My appointment booking page is showing an error"
    WA->>Router: Inbound Webhook Payload
    Router->>DB: Verify Authorized Client Phone Number & Project ID
    Router->>AI: Trigger Support Investigation Pipeline
    AI->>Hostinger: Fetch Container Error Logs & Health Status
    AI->>Repo: Inspect OpenSpec & Source Code
    AI->>AI: Diagnose Root Cause & Formulate Patch
    AI->>Repo: Apply Code Fix & Run Automated Tests
    AI->>Repo: Update OpenSpec & Changelog
    AI->>Repo: Git Commit & Tag Safe Release
    alt Auto-Deployment Approved (Low Risk)
        AI->>Hostinger: Trigger Zero-Downtime Start-First Rolling Update
        Hostinger-->>AI: Deployment Health Check: 200 OK
        AI->>WA: "Issue resolved. Fixed validation bug and deployed update."
    else High-Risk Change (Schema / Payment)
        AI->>WA: "Issue diagnosed. Patch ready. Awaiting your approval to deploy."
    end
```

---

## 2. Safety Gates & Risk Classification

| Risk Level | Description | Execution Policy |
| :--- | :--- | :--- |
| **Low Risk (Tier 1)** | UI formatting, typo fix, static content update, client text revision | Autonomous test, commit, push, and deploy to Hostinger VPS. |
| **Medium Risk (Tier 2)** | Workflow logic update, email notification template, non-breaking API tweak | Autonomous test and commit; requires client/admin confirmation to deploy. |
| **High Risk (Tier 3)** | Database schema migration, payment gateway changes, credential rotations | Requires Lead Architect manual review and explicit approval. |

---

## 3. Security & Anti-Spoofing Protocols
- **Phone Number Whitelisting:** Only verified phone numbers registered in `registry/clients.yaml` can trigger support workflows.
- **HMAC Webhook Verification:** All Meta WhatsApp Cloud API webhooks verified with SHA-256 signatures.
- **Zero Cross-Client Leakage:** AI agent session is restricted strictly to the identified client's repository and database schema.

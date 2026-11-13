# Client Requirements Register Standard

> **Standard for managing client expectations, deliverables, pending inputs, and asset tracking across all software projects.**

---

## 1. Purpose & Two-Way Requirement Architecture

Every client project repository must maintain a live, version-controlled **`CLIENT_REQUIREMENTS_REGISTER.md`** file.
It strictly categorizes information into two distinct perspectives:

```text
┌─────────────────────────────────────────────────────────────┐
│                 CLIENT REQUIREMENTS REGISTER                │
├──────────────────────────────┬──────────────────────────────┤
│ 1. REQUESTED BY CLIENT       │ 2. REQUIRED FROM CLIENT      │
│    (What we build/deliver)   │    (What we need from client)│
│    - Feature deliverables    │    - Branding, logo, colors  │
│    - Business workflows      │    - Photos, videos, copy    │
│    - UI/UX specifications    │    - Approvals, credentials  │
│    - Integrations & APIs     │    - Domain, hosting access  │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 2. Standardized Lifecycle Statuses

Every line item in the Requirements Register must be tagged with one of the following exact statuses:

| Status Code | Meaning | Action Trigger |
| :--- | :--- | :--- |
| `NOT REQUESTED` | Scope not yet requested by client. | Baseline documentation |
| `REQUESTED` | Feature or asset requested, pending delivery/receipt. | Assigned to backlog or client follow-up |
| `RECEIVED` | Asset or input received from client, pending review. | Lead architect review |
| `UNDER REVIEW` | Requirement under technical or business analysis. | Architecture / OpenSpec drafting |
| `APPROVED` | Requirement or asset approved for development/use. | Implementation in progress |
| `BLOCKED` | Dependent on external block, decision, or client input. | Flagged in task board |
| `NOT APPLICABLE`| Explicitly excluded or out of current scope. | Preserved for audit |

---

## 3. Synchronization Rule

- The client repository maintains the primary working copy at `F:\Clients\<ClientName>/CLIENT_REQUIREMENTS_REGISTER.md`.
- The Meta Control Plane maintains a synchronized snapshot in `F:\Clients\MetaDataProjects\clients/<client-id>/CLIENT_REQUIREMENTS_REGISTER.md`.
- Sync is performed automatically via `powershell automation/scripts/sync-ecosystem.ps1`.

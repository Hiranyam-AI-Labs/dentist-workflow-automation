# OpenSpec: Google-Grade Developer Handover & Documentation Standard

> **Specification ID:** `SPEC-GOV-HANDOVER-001`  
> **Status:** Standard / Active Production  
> **Scope:** Enterprise-wide (All 21+ Client Projects across the Control Plane)

---

## 1. Core Mandate: Zero-Friction Turnkey Handover

Every software system, AI workflow, database, and automation service built across the enterprise MUST be maintained to Google-grade product engineering standards. 

When any incoming developer, AI agent, or systems architect opens any child repository under `F:\Clients\<ClientName>`, they must be able to achieve **100% conceptual and operational comprehension within 15 minutes** without requiring prior verbal explanation or tribal knowledge.

---

## 2. Mandatory Documentation Hierarchy per Repository

Every client repository must strictly maintain:

```text
F:\Clients\<ClientName>\
├── README.md                              # Google-grade executive & developer entry point
├── docs/
│   ├── DEVELOPER_HANDOVER_GUIDE.md        # Deep architectural runbook, node dictionaries, failure recovery
│   └── ARCHITECTURE.md                    # Subsystem boundaries and integration contracts
├── database/
│   ├── README.md                          # Schema dictionary, ER relationships, migration order
│   ├── migrations/                        # Forward-only versioned SQL migrations (001_..., 002_...)
│   └── seeds/                             # Controlled reproducible baseline seed records
├── workflows/ (or src/)
│   └── README.md                          # Graph diagrams, component maps, and execution flow
├── openspec/
│   └── master-spec.md                     # Authoritative portable specification
├── PROJECT_STATUS.md                      # Live delivery state, components delivered, validation results
└── CLIENT_REQUIREMENTS_REGISTER.md        # Client requirements, signed acceptance, and SLAs
```

---

## 3. Mandatory Handover Checklist for AI Agents & Developers

Before declaring any coding, database, or workflow task complete, the agent MUST verify:

1. **Schema & Migration Integrity:**
   - Any database table alteration or column addition MUST have a corresponding forward-only migration file in `database/migrations/` and updated seeds in `database/seeds/`.
   - The database dictionary in `database/README.md` and `docs/DEVELOPER_HANDOVER_GUIDE.md` must accurately document every new column, constraint, and index.

2. **Workflow Graph & Node Documentation:**
   - Any added or updated node in an n8n workflow or backend service must be documented with its purpose, inputs, outputs, and edge-case behaviors.

3. **Platform Formatting & UI/UX Standards:**
   - WhatsApp automations must enforce platform-native markdown formatting (e.g. single asterisks `*bold*`). Double asterisks `**` are strictly forbidden.
   - Web apps and presentation decks must adhere to the Meaningful Content and Mobile-First Universality Protocols.

4. **1-Click Diagnostics & Reproducibility:**
   - Every automation workflow must be diagnosable via `powershell automation/scripts/diagnose-workflow-execution.ps1 -Client <ClientName>`.
   - Handover documents must cite the exact one-liner commands needed to inspect logs, run health checks, and test edge cases.

5. **Synchronization with Control Plane:**
   - Changes must be registered in `MetaDataProjects/registry/` (`automation-workflows.yaml`, `databases.yaml`, `clients.yaml`).
   - Atomic conventional commits must be made in the child repository and the central control plane.

# ADR-0027: Universal Project-Specific Credential & Server Isolation System (P0 Rule 30)

- **Status:** Approved & Enforced (P0 Rule 30)
- **Date:** 2026-10-08
- **Deciders:** Principal Architect, Lead DevOps Engineer, Security Auditor, Systems Orchestrator
- **Scope:** Universal across all 500+ past, present, and future projects, subagents, and deployment pipelines

---

## 1. Context

Across Hiranyam AI Labs, over 500+ projects and automated client deployments will be managed simultaneously. In early stages, many development prototypes utilized the shared enterprise dev Hostinger VPS (`72.62.198.241`). 

However, as projects advance into production, each client project has or will have dedicated production infrastructure:
- Distinct Hostinger VPS instances
- GoDaddy servers
- Custom VPS providers / VPN networks
- Cloud VMs (AWS EC2, Azure VM, Google Cloud Compute)
- Isolated database clusters (PostgreSQL, MySQL, Redis, MongoDB)

### The Catastrophic Failure Mode (Cross-Contamination Havoc)
If an automated AI agent or developer assumes or falls back to shared dev credentials or guesses SSH hosts when deploying a client:
1. Client A's code or database migrations could be executed on Client B's production server.
2. Production data, customer records, and live applications could be overwritten, corrupted, or destroyed.
3. Sensitive credentials, SSH keys, API secrets, and PII could leak across client isolation boundaries.
4. Unintended deployments to wrong servers create operational havoc and liability.

Therefore, an absolute, non-negotiable **Zero Cross-Contamination Standard** must be enforced across all tooling, autonomous agents, and documentation.

---

## 2. Decision

We enforce **P0 Rule 30: Universal Project-Specific Credential & Server Isolation Standard** with seven binding rules:

### 1. Per-Project Server Identity Register (`server-identity.yaml`)
Every project workspace MUST declare its own `server-identity.yaml` inside its client folder:
`clients/<client-id>/server-identity.yaml`.
This file is the single authoritative source of truth for that project's infrastructure topology (development, staging, production).

### 2. Zero Shared Default Assumptions for Production
- The shared Hiranyam Dev VPS (`72.62.198.241`) is strictly restricted to internal development and prototyping.
- No AI agent, automated pipeline, or script may EVER assume or fall back to `72.62.198.241` as a default production target.
- For production, every project MUST have an explicitly declared and verified dedicated host.

### 3. Registry-First Lookup Protocol (Mandatory Agent Execution Gate)
Before initiating ANY deployment, SSH connection, container orchestration, or database migration, every AI agent MUST:
1. Query `registry/server-registry.yaml` (central machine-readable registry).
2. Query `clients/<client-id>/server-identity.yaml` (per-project identity; project-level declarations take precedence).
3. If NEITHER exists or if the production host is undeclared:
   - **IMMEDIATELY HALT**.
   - Prompt the user explicitly: *"Which server/VPS host and credentials should be used for project <client-id>? I do not have server identity for this project and will not guess."*
4. Never proceed with deployment until the user or registry explicitly confirms target server parameters.

### 4. Credential Reference Only (Zero Inline Secrets)
`server-identity.yaml` and `registry/server-registry.yaml` MUST NEVER store raw passwords, private SSH keys, or access tokens inline. They store only references:
- Environment variable references: `env:HEMKAR_PROD_SSH_PASSWORD`
- Key file paths relative to user profile: `keyfile:~/.ssh/hemkar_prod_hostinger`
- Naming convention: `<PROJECT_ID_UPPERCASE>_<ENV>_<CREDENTIAL_TYPE>`

### 5. Strict Environment Tiering & Explicit Production Opt-In
Every project declares environments with granular opt-in flags:
- `dev`: Prototyping / internal testing.
- `staging`: Pre-production validation.
- `production`: Dedicated live client environment.
By default, `production.enabled` is initialized to `false` until the production server has been explicitly provisioned and approved.

### 6. Interactive Confirmation Header Gate
Before executing any remote deployment command, the deployment harness or AI agent MUST display an unambiguous confirmation header:
```text
═══════════════════════════════════════════════════════════════════
HIRANYAM AI LABS — SERVER DEPLOYMENT CONFIRMATION GATE
═══════════════════════════════════════════════════════════════════
PROJECT ID   : <client-id>
ENVIRONMENT  : <dev | staging | production>
PROVIDER     : <hostinger-vps | godaddy-vps | aws | azure | custom>
TARGET HOST  : <IP or Domain>
SERVICE NAME : <service-name>
CREDENTIAL   : <ssh_key_ref or ssh_password_ref (REFERENCE ONLY)>
═══════════════════════════════════════════════════════════════════
CONFIRMATION: Target server verified for this specific project.
═══════════════════════════════════════════════════════════════════
```

### 7. Living Loop Engineering Server Audit Log
Every deployment execution recorded in `LOOP-ENGINEERING.md` must log:
- `PROJECT_ID`
- `ENVIRONMENT`
- `TARGET_SERVER`
- `PROVIDER`
- `SERVICE_NAME`
- `CREDENTIAL_REF_USED`
- `SERVER_IDENTITY_FILE_PRESENT: YES/NO`
- `CROSS_CONTAMINATION_CHECK: PASSED/FAILED`

---

## 3. Consequences

### Positive
- **Zero Cross-Contamination**: Impossible to deploy Client A's payload onto Client B's server by accident.
- **500+ Project Scalability**: Cleanly scales to hundreds of concurrent client projects across diverse hosting providers (Hostinger, GoDaddy, AWS, Azure, custom VPS).
- **Auditability**: Complete transparency into which server and credential reference was targeted in every iteration.
- **Security & Compliance**: Zero inline secret storage in version control.

### Operational Guardrails
- Maintaining `server-identity.yaml` for each project is mandatory upon project creation.
- Automation scripts must fail-closed if server identity is ambiguous or absent.

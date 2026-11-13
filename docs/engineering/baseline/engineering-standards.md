# Engineering Standards — Hiranyam AI Ecosystem

Baseline: `2026.11.11.1` · Effective: 2026-11-11

One business request should supply the business intent. The repository supplies its operating instructions, selected standards, verification commands, current decisions, and unfinished work. These rules apply equally to human engineers and any coding agent.

## Start from the project contract

1. In the control plane, resolve the project through the intent router (control-plane source: `router/intent-router.md`) and project registry (control-plane source: `registry/projects.yaml`). Verify the actual checkout; do not assume a drive letter or search unrelated client files.
2. Read the target repository's instructions, current OpenSpec change, current status, and documented build/test commands. Reuse existing decisions and acceptance criteria before asking the user to repeat them.
3. Record the request and applicable capabilities in `openspec/changes/<change-id>/`. A change needs a problem, acceptance criteria, affected files/components, verification plan, documentation impact, and delivery status. Reuse an existing active change when it covers the same work.
4. Inspect registered reusable components before creating a new implementation. Copy or package a sanitized, versioned component into the target project; never create a runtime dependency on a sibling checkout.
5. Execute [the loop standard](loop-engineering-standard.md), [coding standard](coding-standards.md), [testing standard](testing-standards.md), and [documentation standard](documentation-standards.md).

The control-plane [autonomous engineering playbook](autonomous-engineering-playbook.md), [governance specification](sources/openspec/specs/engineering-governance-spec.md), and governance manifest (control-plane source: `registry/engineering-governance.json`) define baseline distribution. Child repositories consume a pinned local snapshot under `docs/engineering/baseline/`; they do not read these files from a sibling checkout at runtime. Links above identify control-plane sources; use the corresponding local copy in a distributed baseline.

## Apply standards by capability

The baseline always includes project isolation, privacy and consent, secret protection, free/open-source tooling, living code comments, evidence, OpenSpec traceability, and organization Git governance. Additional requirements follow the actual product capabilities:

| Capability | Additional authoritative guidance in the control plane |
| --- | --- |
| Customer web UI | [Frontend](frontend-standards.md), [UI/UX](ui-ux-design-standards.md), [brand endorsement](brand-endorsement-standards.md), [i18n](i18n-standards.md) |
| Mobile application | [Mobile](mobile-standards.md), physical-device and navigation gates in [testing](testing-standards.md) |
| API or database | [API](api-standards.md), [database](database-standards.md), [security](security-standards.md) |
| AI conversation or workflow | [AI automation](ai-automation-standards.md), [trained-answer verification](ai-chatbot-training-kill-critic-standard.md) |
| Presentation | [Presentation](presentation-standards.md) |
| Commercial proposal | [Official proposal letterhead](proposal-letterhead-standard.md) |
| Deployment | [DevOps](devops-standards.md), [credential isolation](credential-isolation-standards.md) |
| Client handover | [Documentation](documentation-standards.md), [developer handover specification](sources/openspec/specs/developer-handover-standard.md) |

Record a reason for each non-applicable gate. A documentation correction does not become a mobile release, a static website does not acquire a database merely to satisfy a checklist, and a policy update does not authorize production deployment. Applicable product requirements remain mandatory.

## Four feedback loops

| Loop | Trigger | Result |
| --- | --- | --- |
| A — Sense, mutate, verify, reflect | Every implementation change | Reproduce the problem, make the smallest coherent fix, run required checks, record evidence and the next action. |
| B — Reconcile | Registry, template, standard, or project metadata changes | Detect drift, review the intended diff, apply scoped updates, and verify idempotency. Inspect legacy `reconcile-ecosystem.ps1` before using `-AutoFix`; broad mutation is not a read-only audit. |
| C — Harvest | A project produces a reusable capability | Parameterize, remove client data and credentials, verify license and tests, version the component, and update the registry. Reuse it in a second context before claiming it is universal. |
| D — Privacy and consent | Before ingestion, evidence capture, promotion, and commit | Run scoped secret/privacy checks; minimize sensitive data and resolve findings before distributing affected material. |

## Reduce repeated work at its source

- Keep one authoritative rule; link to it instead of pasting copies into every instruction file. Child projects receive a pinned local policy snapshot and their own project facts so they remain independent.
- Store exact, repeatable commands with their working directory and prerequisites. Do not make engineers rediscover package scripts, test devices, generators, or deployment parameters each session.
- Promote recurring fixes into a tested component, template, or check. A second identical manual correction should create a recorded automation candidate.
- Preserve project-owned text during standards updates. Generated sections must be identifiable and repeatable; running synchronization twice must produce no second diff.
- Reuse still-valid verification evidence only when the tested inputs, relevant dependencies, configuration, and environment match. Cite the evidence and explain why it remains applicable.

## Delivery and boundaries

Each client remains self-contained. Deployment identity must come from that project's approved identity and secret references under [ADR-0027](sources/openspec/decisions/ADR-0027-project-specific-credential-server-isolation.md) in the control plane. Do not infer a production server, use a shared fallback password, or read sibling environment files.

Deliver a tested, documented, reconciled milestone with an atomic conventional commit and push to the verified `Hiranyam-AI-Labs` origin when available and authorized. Preserve unrelated working changes. Record denied writes, unavailable credentials, missing devices, or failed checks as explicit blockers; never substitute a success claim.

## Migration from earlier defaults

This baseline replaces this document's blanket instructions to run cross-project `-AutoFix`, harvest every change, or assume one shared deployment target. It introduces capability-based applicability, scoped reconciliation, explicit evidence, and project-specific identity under [ADR-0029](sources/openspec/decisions/ADR-0029-versioned-engineering-governance.md). It does not relax applicable security, mobile QA, branding, documentation, or Git requirements. Historical ADRs remain decision history; record a new decision when resolving a conflict rather than rewriting history.

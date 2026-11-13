# Versioned engineering governance

Spec ID: **SPEC-ENG-GOV-001** | Version: **1.0.0** | Baseline: **2026.11.13.1** | Effective: **2026-11-09**

## Problem and scope

Repeated instructions, outdated registry paths, duplicated model manuals, and unenforced claims increase work without providing dependable verification. The control plane must distribute one maintained engineering contract to registered repositories while preserving each project's autonomy and business specifications.

This specification governs shared coding/loop/documentation guidance, its safe distribution, and adoption evidence. It does not certify client application behavior, consent, production readiness, or security.

## Requirements and acceptance scenarios

| ID | Requirement | Acceptance scenario |
| --- | --- | --- |
| GOV-001 | Model-neutral rules with short agent entry points | Gemini, Codex and Claude load the same pinned baseline; no independent rule copies are maintained centrally |
| GOV-002 | Canonical sources and version provenance | Manifest names the baseline version and sources; child lock records generated hashes |
| GOV-003 | Registered, portable scope | Resolve exact relative registry paths, union project/repository rows, deduplicate shared roots and exclude the control plane; unresolved entries stay reported |
| GOV-004 | Preview before writes | Invocation without `--apply` writes no child files; `--check` exits nonzero on incomplete adoption or conflicts |
| GOV-005 | Explicit write boundary | Apply requires an authorized `--write-root`; traversal, symlink escape, and unregistered target paths are rejected |
| GOV-006 | Preserve project ownership | Managed adapter sections preserve outside bytes; existing unmanaged targets and edited generated snapshots are conflicts; business specs and execution logs remain owned by the project |
| GOV-007 | Idempotent updates | Applying an unchanged baseline a second time yields no writes; changed sources are visible as drift |
| GOV-008 | Truthful evidence and resume | Every change links acceptance criteria to actual commands/outcomes and records blockers/next action; file existence never proves application tests passed |
| GOV-009 | Capability-based work | Governance-only changes validate governance; mobile releases retain physical-device action/screen gates; other domain checks apply to affected capabilities |
| GOV-010 | Security and consent preserved | No credential values, customer records, invented consent, blanket commits, deployments, or remote rewrites occur during governance distribution |
| GOV-011 | Complete documentation impact | Affected source and distributable PDFs share a reproducible generator and inventory; unrelated handovers are not regenerated |
| GOV-012 | Reuse and promotion | Search existing capability/component metadata; document reuse/promotion decisions without introducing cross-client runtime dependencies |
| GOV-013 | Security before UAT/production | All applicable release-bound vulnerability, secret, configuration, source, DAST and host gates must be complete; unresolved confirmed findings of any severity or missing checks block deployment; fix, rebuild and re-scan |
| GOV-014 | Developer-owned testing | Assess the complete capability test matrix, discover real commands, implement missing applicable cases and record executed results before client UAT; generated plans cannot grant a pass |
| GOV-015 | Both browser modes | Project harnesses support explicit headless false/true modes; applicable UI release verification runs equivalent cases in both modes and blocks missing modes without fallback |
| GOV-016 | Current verified tools | Review official releases/licenses/advisories for new projects, significant changes and releases; pin compatible verified FOSS versions and regression-test upgrades |
| GOV-017 | Model-independent execution and resume | Every adapter loads the same checklist; the active change records actual context, acceptance evidence, Git state, blockers and next action. Unavailable tools/files cannot be represented as execution. Documentation never claims to train a model or enforce uninspected deployment paths. |

## Source ownership and installed contract

`registry/engineering-governance.json` defines source files/templates and baseline version. Canonical policies live in `standards/`. Installed copies live under `docs/engineering/baseline/`, with a local OpenSpec governance document, local loop procedure, managed agent adapter sections, and `.engineering-governance.lock.json` provenance.

Generated guidance must remain understandable without reading a sibling repository. A project records actual product capabilities, command prerequisites, requirements and runtime evidence locally. Distribution never overwrites a product master specification or historical loop entries.

## Execution and failure behavior

The distributor supports preview, check, and explicit apply. A missing checkout stays missing; reconciliation must not create it. Conflicts require review of the local change and canonical source. Read/write errors and invalid config are failures, never clean results. Reports contain paths, hashes, statuses and counts; never secret values or customer data.

A preview can describe incomplete adoption successfully; a check must fail when that adoption is incomplete. Inspect the report's per-project status, not only the process exit code. Apply/check verification concerns governance files only. It is not a product test suite.

## Verification

Use isolated temporary fixtures for distribution tests: first install, second pass, source update, custom content preservation, unmanaged collision, edited snapshot, invalid path, missing root, symlink escape, adapter marker corruption, and duplicate registrations. Run fresh registered-portfolio preview/check and record scoped rollout outcomes. Validate Markdown links and affected PDF layout separately.

See [ADR-0029](../decisions/ADR-0029-versioned-engineering-governance.md) for superseded defaults and META-005 (control-plane source: `openspec/changes/META-005-repeatable-engineering-governance/proposal.md`) for implementation evidence.

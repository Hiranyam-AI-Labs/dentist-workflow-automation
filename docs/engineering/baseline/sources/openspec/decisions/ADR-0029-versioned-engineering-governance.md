# ADR-0029: Versioned, model-neutral engineering governance

Date: **2026-11-09** | Status: **Accepted for shared governance design; rollout evidence tracked separately**

## Context

The portfolio already has OpenSpec, standards, components and loop logs. Instructions have nevertheless grown into repeated model-specific manuals, stale drive-specific paths and broad automation. Inspection found reconciliation defaulting to mutation, generating an “Approved Baseline,” and substituting `GRANTED` for corrupted consent values. Scanner warnings could exit successfully and validators could increment passed counts without inspecting results. Historical green summaries are insufficient current evidence.

## Decision

Keep one canonical policy set and a versioned manifest. Use short central agent adapters and pinned, self-contained child snapshots. Reconcile by explicit registered targets with preview/check/apply, managed boundaries, prior hashes, and idempotence. Protect local business specifications and custom instructions.

Use capability and change impact to select required checks and affected documents. Preserve the user's coding comments, isolation, privacy, FOSS, responsive UI, brand, mobile physical-device, security, documentation and handover mandates wherever applicable. Capture commands, real results, blockers and resume steps.

## Explicit supersession

| Earlier default | Current rule |
| --- | --- |
| Large independent `AGENTS.md` / `GEMINI.md` policy copies | One shared contract, small model entry points, pinned local baseline |
| Hardcoded `F:\\Clients` / `E:\\Clients` assumptions | Exact paths relative to the control-plane root, verified against existing repositories |
| Reconciliation defaults to `-AutoFix` | Read-only preview; mutation requires explicit apply and a write boundary |
| Generated baseline marked approved or consent repaired to `GRANTED` | Structural adoption only; business approval and consent require independent real evidence |
| Every edit runs every product checklist and regenerates every handover | Verify all affected capabilities and regenerate affected source/output pairs; record non-applicability |
| “100% unbreakable” or warning-only scanners interpreted as PASS | Bounded empirical claims, meaningful nonzero failures, explicit missing-check states |
| Shared hardcoded master credentials/default production host | Declared project/environment identity and reference-only credentials; stop affected operations when absent |
| Unscoped stage/commit/push of all projects during maintenance | Review and publish only intended verified changes in each authorized repository |

These rules supersede contradictory execution defaults in ADR-0019, the earlier single-prompt specification, old loop instructions, and legacy reconciliation/scanner behavior. Specialized product acceptance criteria remain applicable. An installed baseline does not silently grant product approval or waive security/physical testing.

## Consequences

Future policy changes are authored once, tested once, and distributed with per-project drift evidence. Projects remain independent when the control plane is unavailable. More small versioned files are maintained automatically; custom conflicts and missing prerequisites remain visible instead of being overwritten. No tool can promise a defect-free product or zero rediscovery without maintained project facts.

# Repeatable engineering playbook

Baseline **2026.11.11.1** | Governing specification: `SPEC-ENG-GOV-001` | Effective: 9 November 2026

The business prompt supplies the outcome. The repository supplies the operating procedure. A developer should not repeatedly explain the folder structure, coding rules, test sequence, branding, handover format, or deployment boundary.

## The repeatable task map

| Repeated work | Reusable mechanism | Completion evidence |
| --- | --- | --- |
| Rediscover project location and stack | Registered relative path plus local README, instructions, and command record | Verified repository root and current Git state |
| Re-enter standards for each model | Short agent entry points plus pinned shared baseline | Baseline version and matching hashes |
| Rebuild common screens or integrations | Capability lookup, reviewed component catalog, local versioned copy | Component version, license and project tests |
| Recreate OpenSpec structure | One current change with proposal, requirements, design, tasks and validation; bounded corrections may use one combined record | Requirement IDs linked to implementation and checks |
| Guess build/test commands | Project-owned command record from checked-in build configuration | Exact command, tool version, exit code and evidence |
| Repeat failed runs without learning | Failure diagnosis, minimal fix, targeted rerun | Root cause, changed inputs and new outcome |
| Repeat onboarding after interruption | Current tasks and a small resume checkpoint | Last verified step, remaining blockers and next action |
| Manually copy instructions across projects | Preview/apply/check governance distributor | Idempotent second pass and per-project outcome |
| Regenerate every document after a small edit | Impact map of changed behavior to affected Markdown/PDF outputs | Source hash and matching regenerated output |
| Repeat portfolio-wide commits | Scoped per-repository staging and security review | Intended diff, commit ID and push outcome |

## Select capabilities before executing

Every change records `governance`, plus the capabilities it actually affects: `web`, `mobile`, `api`, `database`, `workflow`, `ai-chat`, `presentation`, `deployment`, or `customer-documentation`. A project can have several capabilities. This selection scopes work; it cannot waive a relevant security, privacy, device, branding, or release requirement.

| Change trigger | Required work |
| --- | --- |
| Governance/documentation only | Validate distributor/tests, references, managed hashes and affected PDFs. Do not report app regression testing as performed. |
| Product logic or API | Existing lint/typecheck/build and relevant automated behavior/regression tests; negative and security cases for exposed inputs |
| Schema or sensitive storage | Migration/seed checks, authorization, encryption/tamper tests, isolation, recovery and purge limitations |
| Web UI | Responsive screenshots and all changed controls/flows across the supported device matrix, keyboard and touch checks, no overflow |
| Mobile app | Screen/action inventory, physical handset wireless ADB execution and screenshots, back navigation, offline sync, secure storage and required stress checks |
| Workflow or AI chat | Real sanitized graph execution diagnostics, boundary/format tests, session isolation and trained-answer precedence checks |
| Presentation | Render all affected slides; verify graphics, text fit, headshot mapping, AV audio/video and projector/device behavior |
| Deploy/release | Declared project/environment identity, authorized target, reproducible build, scoped security gates, health check, rollback evidence and current handover package |

Use the project's pinned tools and actual scripts. A command list is incomplete until it has a verified origin in build configuration and an observed result. Do not fabricate test scripts or green statuses. Runtime workflow diagnosis uses the control plane's `automation/scripts/diagnose-workflow-execution.ps1 -Client <client> [-ExecutionId <id>] [-Limit <n>]` when available to an authorized control-plane operator; a child uses its own local diagnostics and never imports a sibling's tooling.

## A compact change record

Capture these fields in the current `openspec/changes/<change-id>/` record. Avoid maintaining the same facts in several files.

```text
Outcome / requirement IDs:
Repository / baseline version / current revision:
Affected capabilities and paths:
Reuse considered and chosen:
Acceptance checks and project commands:
Implementation and documentation impact:
Evidence: command | time | revision or input hash | exit code | artifact | status
Root cause and fix for each failed check:
Blockers and specific next action:
Commit / push / deployment status (only if performed):
```

Keep customer data and secrets out of this record. For resumed work, recheck Git state and changed inputs; reuse evidence only when its input/revision remains applicable. A missing tool, device, credential reference, network route, or write permission is a concrete blocker. Fix independent work, record the blocker, and do not label the dependent gate `PASS`.

## Distribution and maintenance

1. Change the canonical standard once with a scoped OpenSpec record. Increment the manifest baseline version for a released policy/content change.
2. Run distributor unit tests, preview the registered portfolio, and review per-file actions and unresolved paths. The central registry is an index, not proof a checkout exists.
3. Apply to an explicit selection using `--apply --write-root <authorized-parent>`. First installation adds managed blocks and baseline files; updates check previous hashes. Custom instructions and business specs remain owned by the project.
4. Run `--check` for applied projects and repeat the apply preview. A clean second pass proves idempotent distribution, not application correctness.
5. Review, scan, and commit intended files within each repository. Record central rollout results and outstanding conflicts. Push only when the security gate and access permit it.

The distributor is safe-by-default governance reconciliation. Other historical scripts are not implicitly approved to create workspaces, rewrite consent, stage all files, provision repositories, deploy, or repair arbitrary folders. Never run an unattended daemon merely to maintain documentation.

## Policy precedence and practical boundaries

Current user instructions govern the task. Shared safety invariants and the current versioned standard apply next; local product requirements add detail. A local rule may strengthen a check. Record any conflict rather than silently dropping a product requirement. ADR-0029 explicitly supersedes earlier blanket workflow defaults for documentation-only changes, duplicate model instructions, auto-approved baselines, and unscoped reconciliation.

Historical references to paid APIs, hardcoded deployment defaults, “100% unbreakable,” automatic consent, or a fixed drive do not authorize their use. New tooling must meet the free/open-source requirement. Deployment resolves only the declared environment's credential references; missing identity is a blocker. SQLite `VACUUM` alone cannot prove erasure from flash, backups, or remote replicas; record the actual purge guarantees tested.

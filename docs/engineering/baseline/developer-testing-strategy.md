# Developer-owned testing strategy

Baseline **2026.11.11.1** | Effective **11 November 2026**

Developers and engineering agents own pre-delivery quality. Client UAT verifies business acceptance after developer verification; it is not the primary defect-discovery mechanism. With a small team, repeatable automated checks and observable manual verification must travel with each project.

## The common test plan

| Test category | Required when | Acceptance evidence |
| --- | --- | --- |
| Unit and component | Logic, components or state change | Meaningful assertions for expected, boundary and failure behavior |
| Calculation and property | Money, quantities, eligibility, formulas or scores | Independent golden examples, units/rounding, finite guards and generated boundary checks |
| Contract and integration | API, schema, storage, workflow or external adapter | Real supported contracts, permission boundaries, error handling and isolated integration results |
| Functional and end-to-end | User flows or business actions | Complete affected screen/control/flow cases, assertions and sanitized traces |
| Visible and headless browser | Browser-dependent behavior | Equivalent cases in explicit `headless: false` and `headless: true` runs |
| Responsive and accessibility | User interface | Supported viewport/orientation matrix, keyboard/touch/focus/contrast, visual review and automated checks |
| Security and negative | Trust boundaries, dependencies, authorization, inputs or deployment | Current scanner evidence plus injection, tamper, role/tenant separation, unsafe-input and business-rule tests |
| Offline and recovery | Local state, queues, synchronization, migrations or backups | Failure injection, restart/retry/idempotence, conflict resolution and verified restore |
| Performance and concurrency | Resource-sensitive or multiuser capability | Specification-defined workload, latency/resource thresholds and measured results |
| Mobile/device | Mobile application | Required physical handset screen/action, back navigation, rotation and stress evidence |
| Presentation/document | Rendered artifact | Every affected page/slide reviewed for text fit, graphics, navigation and media behavior |
| Release and rollback | UAT or production candidate | Same-artifact full security gates, migrations/recovery, health checks, rollback and current handover |

Every project assesses all categories. A justified `NOT_APPLICABLE` requires no corresponding capability or attack surface; lack of time, staff, tools, credentials or a display is a blocker, not non-applicability. A changed capability requires its full relevant acceptance cases. Keep historical whole-project results distinct from the current changed-scope run.

## Repeatable execution

1. Translate the request into requirement IDs and acceptance cases before coding; list affected screens, controls, data paths and failure modes.
2. Discover actual checked-in commands, toolchain versions and configuration. Reuse maintained tests and improve missing meaningful coverage. A generated checklist cannot invent executable commands or successful checks.
3. Run fast relevant checks during implementation. Diagnose complete failure evidence, fix the root cause, and rerun failed/dependent checks.
4. Complete the affected regression matrix before delivery, including both browser modes where applicable. Keep private raw traces local; publish sanitized evidence and exact result status.
5. Review code, living comments, accessibility/visual behavior, security findings, documentation and recovery. Track missing cases as explicit work rather than handing defect discovery to the client.
6. Commit and publish verified scoped changes. UAT and production remain blocked until complete release requirements pass.

## Current tools without uncontrolled upgrades

For each new project, significant capability addition and release, review current official releases, licenses, security advisories and compatibility of relevant free/open-source tools. Maintain a dated pinned tool inventory and reproducible installation. Use complementary tools for meaningful coverage rather than counting installed products as tests.

Use the [toolchain checklist](toolchain-and-capability-standard.md), project-native test tools, browser automation, accessibility checks, exact arithmetic/property tests and layered security scanners where applicable. Test upgrades in isolation, run regressions, and pin verified versions. Tool discovery and adoption are recurring engineering tasks; installing an unverified latest binary is not quality assurance.

The metadata task planner and project test-plan command prepare the applicable matrix. Local project contracts own actual commands and execution evidence. Shared policy is model-neutral and resumable so another session can continue without asking the user to repeat the testing standard.

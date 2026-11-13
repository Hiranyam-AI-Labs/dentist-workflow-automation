# Engineering governance — dentist-workflow-automation

Baseline: `2026.11.13.2`. Registry classification: `unclassified`. This classification is inventory metadata, not proof that a capability is implemented or tested.

The local baseline directory contains versioned shared coding, testing, documentation, and loop engineering standards. `.engineering-governance.lock.json` records hashes of the installed package. The control plane can preview upgrades and detect drift without replacing project business specifications.

## Project-owned decisions

Keep the business specification in the existing OpenSpec master/specs and preserve accepted ADRs. For each change, record its purpose, acceptance scenarios, affected capabilities, source revision, executable verification commands, expected results, documentation/PDF impact, rollback, and actual evidence. If local commands or deployment details are unknown, discover them from this project and mark unresolved fields BLOCKED. Never invent a deployment endpoint, approval, consent, or passing test result.

Use the applicable profiles from `docs/engineering/baseline/autonomous-engineering-playbook.md`. Web, mobile, database, workflow, presentation, security, and release requirements apply when that capability is changed or released. Physical-device checks remain required for mobile release; an unavailable handset prevents that release claim, while independent documentation work can continue.

## Upgrade ownership

The shared package owns this file, the baseline copies, and `docs/engineering/LOOP-ENGINEERING.md`; project-specific records belong in OpenSpec changes and `docs/engineering/iterations/`. Do not put client data or credentials in the shared package. The updater preserves text outside its marked blocks in agent entry files and refuses to overwrite edited generated files. Review baseline upgrades in Git before an atomic project commit.

The lock detects accidental content drift; it does not authenticate content against deliberate edits to both files and hashes. Review changes and provenance in Git. Package content changes require a new baseline version. Unsupported file encodings, ambiguous markers, or conflicting ownership remain BLOCKED for a reviewed migration.

Powered by Hiranyam AI Labs

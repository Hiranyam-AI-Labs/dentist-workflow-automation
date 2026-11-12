# Documentation Standards — Hiranyam AI Ecosystem

Baseline: `2026.11.11.1` · Effective: 2026-11-11

Documentation should let the next engineer resume work and let the customer operate the product without repeating the original conversation. Keep one authoritative source for each fact and generate or link its other representations.

## Sources, ownership, and traceability

- Keep requirements and acceptance criteria in the active OpenSpec change; accepted behavior belongs in the project's maintained specifications. Record durable architectural choices in an ADR.
- Keep project facts, capabilities, exact commands, prerequisites, and selected baseline version in the project's engineering contract. Keep shared rules in the pinned local baseline under `docs/engineering/baseline/`.
- Keep execution evidence and resume information in `LOOP-ENGINEERING.md`; link to sanitized reports rather than pasting complete logs into several documents.
- Maintain requirement-to-implementation-to-verification traceability. Distinguish requested, implemented, tested, delivered, and blocked states.
- Use repository-relative Markdown links in portable documents. Use absolute file links only when a delivery interface specifically requires them; never assume a developer's drive layout.

The control plane distributes versioned standards; each client remains independent. A child guide must not require access to control-plane or sibling files to build, test, operate, or deploy its product. Generated sections must record their source/version and preserve the project's owned material.

## Update the affected documentation in the same change

| Change | Documentation to review and update when affected |
| --- | --- |
| Business behavior or UI/control | OpenSpec acceptance/specification, requirements/status registers, customer manual/control dictionary, client changelog, relevant screenshots |
| API, data model, workflow, or schema | Interface/node/data dictionaries, architecture, migrations/seeds, developer runbook, OpenSpec specification |
| Security or deployment | Security baseline, approved identity references, deployment/recovery runbook, test evidence; no raw secrets |
| Shared standard, component, or template | Source standard/component, version/provenance, distribution manifest, adoption report, relevant OpenSpec change |
| Documentation-only correction | Affected source, its generated PDF and document inventory when present; validate links and layout |

Always review the change/status record and loop entry. Do not edit unrelated user manuals or regenerate unaffected PDFs merely to update a timestamp. Conversely, an affected PDF may not remain stale because its Markdown source was updated.

## Code comments

[The coding standard](coding-standards.md) owns the mandatory routine header and block documentation rules. Review the comments on every affected declaration and flow in the same patch. Link to this rule rather than duplicating its wording across agent instructions.

## Application and handover documentation

Every application maintains a comprehensive `README.md`, `docs/DEVELOPER_HANDOVER_GUIDE.md`, `docs/user/USER_MANUAL.md`, and the required requirements/status/change records. The developer entry point should enable a new engineer to locate architecture, commands, schemas, deployment, and known issues within 15 minutes; verify this as a navigation/setup task rather than asserting complete understanding.

- `customer-handover/` contains non-technical guides, quick starts, and a dictionary covering every button, icon, input, table column, and modal action. Explain appearance, location, trigger, purpose, and safety using annotated screenshots, callouts, tables, and flows. Use approximately 70% visual/structured content and 30% concise prose. Exclude internal secrets and privileged infrastructure detail.
- `developer-handover/` contains engineering architecture, complete node/data dictionaries, schemas, migration/seed instructions, local setup, test plans, security baselines, diagnostics, and operational recovery procedures.
- `releases/v<Version>/` preserves frozen release manifests and handover archives. Do not modify a historical release archive; create a new release.

Products with no database record that fact instead of inventing migrations. Products with databases maintain forward-only migrations and reproducible non-personal seed data in the standard database directories.

## Markdown, PDFs, and document inventory

Customer, developer, testing, security, and governance documentation delivered under the PDF mandate maintain both source Markdown and a distributable vector PDF. Maintain `DOCUMENT_INVENTORY.md` with source/output paths, document version, generator command, last validated input revision or hash, and verification status.

Use the project's free/open-source generator, such as ReportLab, and preserve searchable vector typography. PDFs require a cover page, document-control table, running headers/footers, two-pass `Page X of Y`, accessible contrast, readable tables, and no clipped content. Render and visually inspect affected pages after regeneration. Commercial proposals additionally follow the dedicated two-page official letterhead standard.

If a source changes, regenerate each affected output, inspect it, and update the inventory in the same commit. If generation or visual inspection cannot run, record `BLOCKED` with the missing prerequisite and do not report the PDF package as current. A link check does not establish PDF layout quality.

## Avoid duplicate maintenance

Generated content needs a reproducible source and a recorded generator. Never manually patch a generated PDF to hide a stale source. Prefer one short index linking architecture, data dictionary, commands, and evidence over repeating these facts in several files. Keep client changelogs readable for the client and developer logs useful for engineers; both can reference one change ID without repeating raw test output.

Before committing, verify local links, applicable required files, source/output inventory consistency, sanitized evidence, and baseline provenance. Record the actual command results under [the loop standard](loop-engineering-standard.md).

## Migration from earlier defaults

This baseline replaces `file:///` links, duplicate comment mandates, and indiscriminate document regeneration with portable references, one rule owner, and affected-source synchronization. Required application handovers and PDF deliverables remain mandatory. It does not fabricate missing legacy PDFs or claim an inventory is current before verification. See control-plane decision `ADR-0029-versioned-engineering-governance`.

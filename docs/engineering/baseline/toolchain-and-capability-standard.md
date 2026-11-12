# Open-source tools and project capability checklist

Baseline **2026.11.11.1** | Sources checked: **9 November 2026** | Intended for existing projects and future intake such as Nirmiti Setu.

This is the reusable selection list for a business prompt in the metadata project. Each project must record decisions for all capabilities below. Implement the relevant capabilities with the existing compatible stack; a checklist entry does not authorize a wholesale migration or a new paid service.

## The master list

Use the [developer-owned test strategy](developer-testing-strategy.md) and [both browser modes](browser-testing-standard.md). Review current official tool releases/licenses/security advisories for new projects, significant capability changes and releases; pin and regression-test compatible FOSS versions. Test execution and evidence remain developer responsibilities before client UAT.

| Capability | Preferred free/open-source option | Mandatory outcome |
| --- | --- | --- |
| Requirements and execution | Existing OpenSpec records; assess upstream OpenSpec CLI when compatible (MIT) | Business intent becomes acceptance scenarios, tasks, implementation and evidence |
| UI system | Project tokens and reusable controls; shadcn/ui (MIT) for compatible React apps | Consistent styled inputs, buttons, tables, navigation, dialogs and page states |
| Accessible interactions | Existing accessible primitives; Radix where compatible | Keyboard/focus behavior, labels, contrast, touch controls and usable errors |
| Component reference | Storybook core (MIT) for substantial reusable UI libraries | Visible examples of states and reusable patterns; small projects may use a local component gallery |
| Coding consistency | Existing formatter/linter/type checker; Biome (MIT or Apache-2.0) for suitable JS/TS baselines | Pinned automated checks plus required function/block documentation; retain necessary existing plugins |
| Input and contract validation | JSON Schema plus Ajv (MIT) in JS/TS; equivalent project-native validator elsewhere | Same explicit data contract at trust boundaries with server-side enforcement |
| Calculation engine | decimal.js (MIT) for JS/TS money calculations; language-native exact decimal where available | One deterministic versioned formula module, units, rounding, finite/range guards and authoritative examples |
| Behavioral and calculation testing | Existing runner plus fast-check (MIT) where compatible | Golden cases, negative inputs and meaningful property checks |
| Browser and visual checks | Playwright (Apache-2.0) | Responsive flow/control evidence and reviewable screenshot comparisons |
| Accessibility checks | axe-core (MPL-2.0) | Automated detectable issues plus manual keyboard/touch review; automation does not prove full accessibility |
| Editable business content | Self-hosted Payload core (MIT) for compatible Next.js; Strapi community core (MIT) for a separate service | Governed editing, validation, drafts, publishing, roles, media, locales and recovery |
| Secret and dependency checks | Gitleaks CLI (MIT); OWASP Dependency-Check (Apache-2.0) when suitable | Redacted findings, meaningful failing exits, dependency review and remediation evidence |
| UAT and production security | Trivy, OSV-Scanner, Grype and OWASP ZAP for their applicable layers | Complete [security release gates](security-standards.md), fixes and re-scans; missing coverage blocks deployment |

Use only the named open-source core/CLI/community features. Paid cloud hosting, commercial UI kits, enterprise CMS plugins and proprietary scan services are excluded. Pin exact versions after checking the target project's compatibility, dependency licenses and advisories. No recommendation here silently installs packages into existing clients.

## CMS decision required for every project

Every project records: content owners, update frequency, editorial roles, localization, media needs, preview/publish workflow, audit history, backup/restore and whether nontechnical editing is needed. When staff must manage FAQs, services, catalog entries, gallery, page copy or announcements, a headless CMS is the default design decision. A small immutable site may record a justified file-based alternative instead of operating an unnecessary service.

For Payload, verify current Next.js/React/Node compatibility before selecting it; do not graft it onto an unsupported older app. For Strapi, stay within the community core: enterprise/cloud features are separate and must not become required under this project's FOSS rule. Keep API permissions server-side and verify drafts cannot leak through public endpoints.

Payload's Local API skips access control by default. User-facing server routes must explicitly pass `overrideAccess: false` with the authenticated user, and carry `req` through transactional operations. Reserve intentional elevated access for reviewed trusted operations such as seeding; test unauthorized reads and writes. Strapi end-user API permissions and CMS administrator roles are separate concerns. [Payload Local API](https://payloadcms.com/docs/local-api/overview), [Strapi Users & Permissions](https://docs.strapi.io/cms/features/users-permissions).

Directus is excluded from the strict FOSS baseline because its current license includes use restrictions and delayed conversion. Self-hostable and zero-cost availability alone do not establish an open-source license. Existing tools recorded in historical registries must be checked before reuse; they are not automatically approved by this list.

n8n is retained as historical inventory where already present; its Sustainable Use License is source-available with use restrictions and does not qualify as the strict FOSS default. This checklist does not authorize a new n8n adoption or a migration of an existing workflow. Record an explicit compatibility/license decision before extending such deployments. [Official n8n license](https://github.com/n8n-io/n8n/blob/master/LICENSE.md), [official license explanation](https://github.com/n8n-io/n8n-docs/blob/main/docs/n8n-community-license/README.md).

## Calculation engine decision required for every project

Record whether the project computes money, quantities, eligibility, tax, estimates, commissions or scores. If yes, keep formulas out of scattered UI handlers and free-form CMS text. Define named inputs/outputs, units, source authority, formula version/effective dates, precision, rounding stage/mode, validation, error states and audit provenance. UI, APIs, exports and PDF reports must consume the same module or verified equivalent contract.

Money uses exact decimals or integer minor units with a declared currency scale. Reject NaN, infinity, invalid dates, unsupported negatives and division by zero. Authoritative expected examples must be independently reviewed; a decimal library or an AI-generated test cannot establish that a business/legal formula is correct. Changed rules require reviewed versioning and regression checks, including past effective dates where relevant.

For decimal.js, accept validated canonical decimal strings at API/persistence boundaries and construct decimals before arithmetic; converting an already-rounded JavaScript `Number` cannot recover lost digits. Declare significant-digit precision separately from currency scale and set the rounding mode/stage explicitly. The library accepts NaN and infinity, so validate finite inputs and results rather than expecting construction or division to reject every invalid business operation. [decimal.js usage and precision](https://github.com/MikeMcl/decimal.js).

Pin the JSON Schema dialect and validator configuration in the contract. Ajv's default export uses draft-07; draft-2020-12 requires the corresponding class and cannot share one instance with older drafts. Keep strict schema checks enabled, validate on the server, and avoid implicit type coercion for monetary inputs. A decimal-string shape check is followed by the engine's exact bounds and scale validation. [Ajv schema versions](https://ajv.js.org/json-schema.html), [strict mode](https://ajv.js.org/strict-mode.html).

CMS editors may change presentation copy and controlled configurable parameters with validation. They must not bypass approved formula versioning, publish executable code, edit production secrets or override authorization rules.

## Prompt to execution

The [task recipe registry](sources/registry/task-recipes.json) maps common language to capabilities and checklists. The planning command emits a concrete checklist without running arbitrary text as code:

```powershell
python automation/scripts/plan-engineering-task.py --project <registered-id> --prompt "Improve the service forms, editable FAQs and quotation calculations"
```

The agent reads that plan, verifies project context, creates/updates an OpenSpec change, implements within the selected repository, runs the recorded checks, fixes failures, updates affected docs and commits verified work. The planner is deterministic preparation, not a replacement for engineering judgment or an app generator.

The user confirmed **Nirmiti Setu belongs to the existing `bbng-parivartan-2027` project**. `registry/project-aliases.json` maps `nirmiti-setu` to that registered project; it is not a separate client or repository. Use that project's local OpenSpec requirements, authorized environment and capability-specific CMS/calculation decisions. The mapping establishes ownership, not unprovided business rules or an invented deployment target.

## Official references

- [OpenSpec project and MIT license](https://github.com/Fission-AI/OpenSpec)
- [shadcn/ui design approach](https://ui.shadcn.com/docs) and [MIT license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)
- [Radix accessibility and composition](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Storybook core license](https://github.com/storybookjs/storybook/blob/next/LICENSE)
- [Biome project](https://github.com/biomejs/biome) and [MIT license](https://github.com/biomejs/biome/blob/main/LICENSE-MIT)
- [Ajv license](https://github.com/ajv-validator/ajv/blob/master/LICENSE)
- [decimal.js documentation and license](https://github.com/MikeMcl/decimal.js)
- [fast-check](https://github.com/dubzzz/fast-check)
- [Playwright license](https://github.com/microsoft/playwright/blob/main/LICENSE)
- [axe-core](https://github.com/dequelabs/axe-core)
- [Payload core and license](https://github.com/payloadcms/payload) and [Strapi license scope](https://github.com/strapi/strapi/blob/main/LICENSE)
- [Directus current license](https://directus.com/license)
- [Gitleaks CLI license](https://github.com/gitleaks/gitleaks/blob/master/LICENSE)
- [OWASP Dependency-Check](https://owasp.org/projects/Dependency-Check)

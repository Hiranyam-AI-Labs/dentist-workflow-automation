# Coding Standards — Hiranyam AI Ecosystem

Baseline: `2026.11.11.1` · Effective: 2026-11-11

These standards apply to all code languages and coding agents. Use the target repository's pinned toolchain and established architecture. A standards update is not permission to upgrade frameworks or rewrite unrelated code.

## Understand and reuse before changing code

Read the affected module, its contracts, tests, and OpenSpec acceptance criteria. Search the project and the control-plane component registry for an existing capability. Prefer one tested implementation with explicit configuration over several near-identical copies. A reusable component must be sanitized, licensed for the required free/open-source use, versioned, and installed locally or as an explicit dependency; no imports, scripts, or assets may depend on sibling client checkouts.

Keep changes bounded to the request. Preserve existing interfaces unless the change specifies a migration. Name modules and types for domain responsibilities, separate UI, application logic, persistence, and infrastructure, and avoid duplicating business rules across those layers.

## Mandatory routine header comments

Every function, method, constructor, API route, worker, and event handler must have a documentation block immediately above its declaration. Use the language's standard syntax. Python uses its canonical first-statement docstring, which is the language-specific equivalent. Annotations/decorators may sit between a comment and its declaration where the language requires them.

Each block must explain:

- Architectural purpose and exact business responsibility.
- Inputs: parameter names, types, constraints, units, expected values, and trust boundary.
- Outputs: return type, guarantees, empty/null outcomes, and state changes.
- Failure behavior: exceptions, error responses, retry/rollback rules, and recovery limits.
- Debugging guidance: useful invariant or sanitized diagnostic location; never credentials or raw personal data.

Use a concise block for a simple routine and more detail for a complex contract. Document callbacks and local helpers too; lint annotations alone do not replace the business explanation. Do not paste a long generic comment that says nothing about the actual implementation.

## Explain the flow at block and type level

Document every class, interface, record, enum, state object, and model with its domain role, invariants, ownership, and relationships. Add contextual comments for branches, loops, transformations, transactions, validation boundaries, and algorithmic steps explaining why they exist and how data moves. In particular, document fallback behavior, ordering assumptions, rounding/units, idempotency, authorization, and cryptographic invariants.

Comments must explain the decision rather than merely restate the syntax. Keep the explanation next to the relevant block so future engineers can debug without reconstructing its intent from distant prose.

## Living documentation

Whenever a declaration or block changes, review its comments in the same patch. Update altered inputs, outputs, side effects, edge cases, and failure behavior; remove obsolete explanations. If a comment remains accurate, retain it rather than making a meaningless wording change just to create a documentation diff. Behavior changes also update affected OpenSpec, schemas, runbooks, and manuals under [documentation standards](documentation-standards.md).

## Language and toolchain conventions

| Stack | Required practice |
| --- | --- |
| TypeScript / JavaScript | Enable the project's strict type/lint rules; prefer typed boundaries and async/await; use JSDoc/TSDoc and the repository's formatter. |
| Java | Keep layered packages; use the declared JDK, Maven/Gradle wrapper, dependency pins, and Javadoc. Do not silently replace a maintained legacy runtime. |
| Python | Use the declared interpreter/environment, type annotations, PEP 8 formatting, and standard docstrings. |
| Dart / Flutter | Use the project's SDK constraint, Effective Dart conventions, documented widgets/state, analyzer, and formatter. |
| SQL | Use parameter binding, explicit transaction boundaries, documented forward-only migrations, reproducible synthetic seeds, and a stated recovery procedure. |
| PowerShell / shell | Use documented parameters, explicit paths, terminating failure behavior, and the repository's declared runtime. Support a non-mutating plan where a script can change multiple projects. |
| Other languages | Use the repository's established native documentation, formatter, analyzer, and lockfile conventions. Record missing commands instead of inventing a successful check. |

Commit deterministic configuration and lockfiles where supported. Put exact build/lint/test commands and prerequisites in the project's engineering contract so each new session uses the same checks. Inspect local tools and installed documentation before selecting new versions.

## Secure and predictable implementation

- Validate external inputs at boundaries and return deliberate error states. Handle empty input, invalid numbers, zero division, timeouts, and malformed data where those cases are relevant.
- Use bound queries, output encoding, least privilege, authorization checks, and authenticated encryption according to the applicable security/data standards.
- Use bounded retries with backoff for retryable failures and idempotency for repeated side effects. Do not swallow exceptions or convert failures into apparent success.
- Keep secrets outside source control, examples, prompts, logs, and generated documents. Refer to project-owned secret identifiers and redact sensitive evidence.
- Keep customer interfaces responsive, accessible, styled, and consistent with the mandatory `Powered by Hiranyam AI Labs` endorsement. Follow applicable platform standards rather than embedding those UI details into every module.

## Verification and migration

Run the checks defined in [testing standards](testing-standards.md). New or changed business behavior needs meaningful verification of its observable outcome, failure boundaries, and regressions. Do not add tests that merely repeat the implementation, run a whole-repository formatter for a local fix, or claim code is verified because it was generated.

This baseline replaces duplicated language examples and universal version assumptions with project-pinned commands and explicit contracts. It preserves the mandatory function/header and block documentation policy. Legacy comment debt outside the change is recorded for planned remediation; a focused change must not silently expand into an unreviewable rewrite. See control-plane decision `ADR-0029-versioned-engineering-governance` for baseline governance.

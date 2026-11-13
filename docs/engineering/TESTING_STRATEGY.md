# Developer testing strategy — dentist-workflow-automation

Baseline: `2026.11.13.1`. Registered type: `unclassified`. Developers and engineering agents own complete capability QA. Client UAT is additional business acceptance after developer verification.

## Project-owned acceptance and commands

For each OpenSpec change, record requirement IDs, affected capabilities, observable cases, negative boundaries, exact project-owned commands, working directories, prerequisites, and evidence. Use the local baseline developer-testing and browser-testing standards. A generated checklist or discovered package script does not demonstrate coverage or a passing test.

Assess unit/component, calculation/property, contract/integration, functional E2E, browser modes, responsive/accessibility, security/negative, offline/recovery, performance/concurrency, mobile-device, document/presentation, and release/recovery applicability. Missing relevant harnesses, cases, displays, devices, or credentials remain BLOCKED. Record a factual reason for every approved NOT_APPLICABLE category.

## Both browser modes

Browser-dependent acceptance uses equivalent cases and the same tested artifact in explicit headed (`headless: false`) and headless (`headless: true`) runs. `BROWSER_TEST_MODE` selects the mode; default local operation is headed. Validate that the actual harness honors the selection. Never silently fall back when a display or mode is unavailable. Keep each mode NOT_RUN until executed; paired release evidence must identify cases, mode, source/artifact, actual result, and sanitized evidence.

## Resume and delivery

Keep actual results in project-owned OpenSpec changes and `docs/engineering/iterations/`; link the latest entry from the loop log. Diagnose failures, correct them, and rerun failed/dependent and full applicable acceptance checks before delivery. Installing tools, generating plans, or receiving client approval cannot replace developer QA.

Powered by Hiranyam AI Labs

# ADR-0030: Developer-owned QA and dual-mode browser testing

Date: **2026-11-11** | Status: **Accepted operating requirement** | Baseline: **2026.11.11.1**

## Context

The user has a small development team and requires defects to be found before client testing. The user first requested visible browser testing, then clarified that both headless and visible options must exist. The final requirement is both modes, broad applicable test coverage, and continuing evaluation of current free/open-source tools.

## Decision

Developers and engineering agents own pre-delivery testing. Client UAT verifies business acceptance after engineering verification. Shared capability matrices cover meaningful unit/component, calculation/property, contract/integration, functional/E2E, dual-mode browser, responsive/accessibility, security/negative, offline/recovery, performance/concurrency, mobile/device, document/presentation and release/rollback tests.

Project test harnesses provide explicit `headless: false` and `headless: true` modes through validated local configuration. Default local investigation is headed; automated runs declare their mode. Applicable UI release checks require evidence from both modes. Missing environments or tests remain blocked; no fallback or generated checklist grants a pass.

Each new project, significant capability change and release reviews current official tool versions, licenses, advisories and compatibility. Verified versions are pinned and regression-tested. Source-visible software is not automatically FOSS. Production browser rendering defaults are not changed merely to configure a test harness.

## Implementation and consequences

The control plane distributes the testing strategy, browser standard and machine-readable `registry/testing-policy.json` with the new versioned baseline. Project-specific plans discover actual commands and gaps without inventing execution. Source changes require synchronized docs and applicable generated PDFs. This extends ADR-0029 and does not relax security, physical-device or release requirements.

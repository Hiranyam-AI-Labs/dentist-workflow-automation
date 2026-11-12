# Testing Standards — Hiranyam AI Ecosystem

Baseline: `2026.11.11.1` · Effective: 2026-11-11

Verification must demonstrate the acceptance criteria of the actual change. Use the target repository's declared commands and prerequisites. Never report a check as passed because a file exists, a command was proposed, or an agent reviewed the code.

## Select and record applicable gates

At planning time, map each acceptance criterion and affected capability to a test/check. Record the working directory, exact command, expected outcome, required fixtures/environment, and evidence location. Use synthetic data and isolated test services; tests must not send live messages, collect real payments, or delete production data as an incidental side effect.

| Change or capability | Minimum verification |
| --- | --- |
| Documentation/policy | Syntax or structure, local links, required references, internal consistency, and source/output PDF checks where applicable |
| Governance generator or synchronization | Isolated fixture tests for intended updates, unrelated-content preservation, path boundaries, conflicts/failure exit codes, and a second no-op run |
| Business logic | Representative outcomes, relevant boundaries/negative inputs, and a regression test for the reported defect where useful |
| API/database | Contract, validation, authorization, transaction/error behavior, migrations and rollback/recovery, and relevant integration tests |
| Web UI | User journeys, controls/forms/modals, keyboard/accessibility, responsive rendering, branding, overflow and error/loading states |
| Mobile app | Analyzer/build, unit/widget/integration coverage, physical-handset screen/action/navigation checks, screenshots, and applicable release stress/security tests |
| AI/n8n workflow | Real execution diagnostics, boundary/data transformations, negative rules, session isolation, trained-answer priority, and sanitized execution evidence |
| Deployment | Approved identity/boundary checks, actual build/release artifact, health/readiness checks against the declared target, and recovery readiness |
| Presentation/proposal/PDF | Required source assets/content, rendered visual inspection, pagination, media behavior, and product-specific layout rules |

Run focused checks during the inner fix loop, then the full applicable acceptance/regression gates before release. Reuse valid evidence only with its input and environment provenance. Unaffected checks may remain linked to earlier valid evidence; missing or invalidated required checks remain open. Do not run every client project merely because one project's documentation changed.

## Result states and evidence

Use `PASS`, `FAIL`, `BLOCKED`, `NOT RUN`, or `NOT APPLICABLE` as defined in [the loop standard](loop-engineering-standard.md). Each result identifies the tested revision/files, command, actual exit code or observed interaction, timestamp with timezone, environment/device, and sanitized evidence path. Explain all blocked and non-applicable checks.

A required `FAIL`, `BLOCKED`, or `NOT RUN` result prevents verified release sign-off. Do not erase failures; link them to their correction and rerun. Keep full diagnostic logs available locally for root-cause analysis, while shared reports minimize personal data and exclude credentials.

## Responsive website and dashboard acceptance

Developers and agents complete the [common test strategy](developer-testing-strategy.md) before client UAT. Browser test harnesses support explicit `headless: false` and `headless: true` options. Use both modes for applicable UI release verification under the [browser testing standard](browser-testing-standard.md); an unavailable required mode is `BLOCKED`, not silently replaced by the other.

For the applicable product, exercise every documented user flow and control: navigation, filters, forms, validation, modal open/close, error states, and relevant API interactions. Test web pages at mobile portrait/landscape, tablet portrait/landscape, laptop, and desktop widths, including the required breakpoints `360`, `480`, `768`, `1024`, and `1280` CSS pixels and a wide desktop view.

Verify no horizontal overflow, clipped headers, overlapping controls, or inaccessible content. Multi-column layouts must stack as required, touch targets must meet the product's minimum, and controls must use the approved styling/focus behavior. Verify keyboard access and contrast. Capture representative screenshots and inspect them visually; automated dimensions alone do not prove readable rendering. Check the persistent `Powered by Hiranyam AI Labs` endorsement in the relevant states without covering content or controls.

## Mandatory mobile physical-device acceptance

Before mobile application release, connect to the developer's physical handset using ADB Wireless Debugging. Record the actual device and connection details without publishing sensitive identifiers. Typical commands are:

```text
adb connect <device-address>:<wireless-debugging-port>
adb devices
adb install -r <verified-apk-path>
```

Execute every screen and action directly on the handset: tabs, buttons, fields, forms, filters, menus, quizzes, dialogs, bottom sheets, and other product flows. Exercise authorized test payment flows with test credentials/data. Capture and visually inspect physical screenshots using `adb exec-out screencap` through a binary-safe capture method; keep a screen/action evidence matrix.

Verify internal tab history returns in reverse order, contextual sub-states dismiss first, and root Home/Login shows the required exit confirmation with both Cancel and Exit App behavior. Check mobile/tablet portrait and landscape layouts, zero RenderFlex overflow, text fitting, safe areas, and the persistent endorsement. Use appropriate additional devices/emulators for the wider supported device matrix; label them accurately.

Physical-device monkey testing requires at least 300 random UI events with zero observed crashes or ANRs, plus controlled recovery and data cleanup. Emulator, widget, or browser results do not replace the physical-handset requirement. If the handset, wireless pairing, APK, or necessary test account is unavailable, mark the required physical checks `BLOCKED` and state the prerequisite. Preserve automated progress without claiming customer sign-off.

## Negative, security, and stress acceptance

Applications must exercise applicable boundary values, empty/malformed input, NaN/Infinity, zero-division protection, timeouts, SQL injection, XSS containment, authorization, and concurrent operations. Encryption-bearing products must verify authentication/tag failure on a one-bit ciphertext or MAC change, role masking, and the documented purge/reset workflow. Test offline/outbox/reconnect behavior where the product implements it. Record a reason when a test category has no corresponding attack surface or capability.

Set concurrency, payload, latency, and resource thresholds from the product specification before executing stress tests. Use isolated non-production fixtures and report measured outcomes; a finite passing test suite does not prove a product is unbreakable. Security claims must match actual evidence and scope.

## Failure loop and required documentation

Reproduce failures, read their complete local traces, fix the root cause, rerun the failed and dependent checks, then complete the required acceptance suite. Record meaningful hypotheses and avoid repeating identical failed attempts without new information. A blocker cannot be converted to `NOT APPLICABLE` merely to obtain a green report.

Update affected test plans, OpenSpec criteria, loop evidence, screen/action reports, and handover PDFs under [documentation standards](documentation-standards.md). Store repeatable commands and reusable fixtures in the project so the next session does not rediscover them. New tooling must remain within the free/open-source policy.

## Migration from earlier defaults

This baseline replaces universal zero-defect assertions and an undifferentiated test list with measurable capability gates and truthful evidence under control-plane decision `ADR-0029-versioned-engineering-governance`. It preserves exhaustive applicable application acceptance, mandatory real-device mobile QA, and negative/security/stress requirements. Documentation-only checks establish documentation quality; they do not certify an unchanged application or an untested device flow.

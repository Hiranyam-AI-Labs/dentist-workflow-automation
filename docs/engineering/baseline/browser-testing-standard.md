# Browser testing in visible and headless modes

Baseline **2026.11.11.1** | Effective **11 November 2026** | Explicit user requirement

Every browser test harness supports both `headless: false` and `headless: true`. Use visible browsers for investigation, guided review and observing user flows. Use headless browsers for repeatable automated regression. Applicable UI release verification requires evidence from both modes; neither mode silently substitutes for the other.

## Configuration contract

Use one explicit validated mode selector in project-owned test configuration. Default local investigation to visible mode. CLI and CI invocations must state their mode. Preserve existing browser options, device projects, assertions and test coverage.

```typescript
// Browser test configuration: reject invalid mode values instead of silently changing mode.
const browserMode = process.env.BROWSER_TEST_MODE ?? 'headed';
if (!['headed', 'headless'].includes(browserMode)) {
  throw new Error('BROWSER_TEST_MODE must be headed or headless');
}
const launchOptions = { headless: browserMode === 'headless' };
```

Playwright configuration uses `use: launchOptions`. Direct Playwright/Puppeteer launches merge `launchOptions` into their approved options. For an explicit visible Playwright CLI run, use `--headed`; an automated headless run sets `BROWSER_TEST_MODE=headless` in the validated project configuration. Do not assume every framework has the same CLI flags.

## Required evidence

Record the mode, browser/version, exact command, tested revision/input, viewport/device profile, assertions, actions and sanitized screenshots or traces. Confirm the visible browser opens and the intended flows execute. Use the same acceptance cases in both modes and investigate mode-specific failures.

Continue mobile portrait/landscape, tablet and desktop coverage. Browser viewport emulation does not replace required physical-device testing. If a mode lacks a usable display, browser binary or supported environment, its check is `BLOCKED`; complete independent work without labeling the missing run as passed.

This policy governs testing. Production document/image renderers and non-browser tools such as dependency scanners, unit tests and PDF rasterizers retain their appropriate execution model. Test harnesses exercise browser-dependent production behavior through an explicit mode rather than changing production defaults accidentally.

The shared machine-readable contract is `registry/testing-policy.json`. Each child receives its local pinned snapshot and applies the configuration in its own harness. A policy document or generated test plan is not evidence that tests executed.

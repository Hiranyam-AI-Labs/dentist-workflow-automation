# Loop Engineering Standard

Baseline: `2026.11.11.1` · Effective: 2026-11-11

Loop engineering turns a business request into a verified change, then turns repeated effort into reusable automation. The loop is complete only when its applicable acceptance criteria have evidence. A confidence score or an agent's assertion is not verification.

## The closed loop

`Understand → Plan → Build → Validate → Fix → Refine → Document → Deliver`

Deploy is the final delivery action when the change includes deployment. Documentation and evidence are maintained throughout the cycle.

| Phase | Required action | Exit evidence |
| --- | --- | --- |
| Understand | Read the project contract, active OpenSpec record, known defects, and last loop entry. Identify the user's observable outcome. | Request linked to a change ID; confirmed facts and unresolved questions distinguished. |
| Plan | Select applicable standards and reusable components. Define acceptance criteria, risks, commands, and documentation impact. | A reviewable plan with measurable checks and a declared target environment. |
| Build | Make the smallest coherent implementation using project conventions and documented interfaces. | Changed files, updated living comments, and no cross-client dependencies. |
| Validate | Execute the checks required by the [testing standard](testing-standards.md). Capture actual exit codes and sanitized evidence. | Results tied to the tested revision or input fingerprint. |
| Fix | Read the complete error output locally, isolate the root cause, patch, and rerun failed and dependent checks. | Failure-to-fix trace and new results. Sensitive logs stay out of shared evidence. |
| Refine | Verify error states, accessibility, responsive behavior, and product-specific quality gates. | Acceptance criteria checked individually; remaining defects visible. |
| Document | Update affected OpenSpec, runbooks, manuals, PDFs, inventory, and change records. | Consistent source and deliverables under the [documentation standard](documentation-standards.md). |
| Deliver | Reconcile scoped metadata, review the diff, commit, push, and perform authorized deployment/health verification where applicable. | Commit and delivery references, or a precise remaining blocker. |

## Evidence states and completion

Use one state for each gate, with a reason and evidence reference:

| State | Meaning |
| --- | --- |
| `PASS` | The stated check actually ran against identified inputs and met its acceptance criterion. |
| `FAIL` | The check ran and did not meet its criterion. |
| `BLOCKED` | A required check cannot run because a named prerequisite is unavailable. Record who or what can unblock it. |
| `NOT RUN` | The check has not been attempted. It is not evidence of success. |
| `NOT APPLICABLE` | The capability or risk does not exist in this change/product; give the factual reason. |

A required `FAIL`, `BLOCKED`, or `NOT RUN` gate prevents claiming the corresponding release or deployment is verified. A successful documentation or build check does not prove the whole application is defect-free. State the achieved scope and its remaining limits.

## Resume without rediscovery

Maintain `LOOP-ENGINEERING.md` as a compact chronological index, with detailed sanitized evidence in the project's normal report directory. An entry must contain:

```markdown
## <timestamp with timezone> — <change-id> — iteration <number>
- Objective and acceptance criteria: <OpenSpec relative link>
- Inputs: <commit plus changed-file fingerprint or explicit tested file set>
- Applicable capabilities and gates: <links; reason for any N/A>
- Change: <implementation summary and relevant paths>
- Verification: <working directory, exact command, exit code, status, evidence path>
- Root cause and correction: <for failed iterations>
- Documentation and generated outputs: <updated sources/PDFs or reason unaffected>
- Reuse/reflection: <component reused; repeated-task automation candidate>
- Delivery: <commit/push/deployment state and verified target when relevant>
- Next action / blocker: <concrete step; missing prerequisite; owner if known>
```

Read the last entry before starting a new session. Resume the recorded next action. Reuse evidence only when its tested inputs and relevant environment are still valid; otherwise rerun the affected checks. Never copy a previous `PASS` into a new run without provenance.

## Failure handling and bounded progress

Read full local errors rather than diagnosing from truncated summaries. After each correction, rerun the failing check and its dependent checks. If the same failure persists after three materially different attempts, record the attempted hypotheses and reassess the plan, dependency, or missing prerequisite. Continue independent work; do not repeat the same command indefinitely or silently weaken acceptance criteria.

For n8n or AI workflow diagnosis, run the control-plane execution diagnostic for the selected client and execution, as required by the repository instructions. Record the execution ID and sanitized result. Static workflow JSON inspection does not establish real execution success.

## Reconciliation, harvesting, and privacy

The four feedback loops and their triggers are defined once in [engineering standards](engineering-standards.md). Reconciliation starts with an audit and reviewable plan. Apply only the selected project/policy changes, preserve local sections, then verify that a second run has no new changes. Do not run legacy ecosystem-wide mutation as a substitute for a scoped plan.

Promote a recurring fix through the component factory only after sanitization, parameterization, tests, and registry provenance. Keep credentials, client content, and raw sensitive execution traces out of the component and evidence packages. Privacy or secret findings block distribution of affected material until resolved.

## Product and deployment gates

- Mobile release verification includes physical-handset ADB wireless execution, every screen/action, navigation/back/exit flows, screenshots, and required stress tests. Missing device access is `BLOCKED`, never an emulated physical-device `PASS`.
- Web changes require responsive checks, styled controls, accessible interactions, and the persistent endorsement under the applicable frontend standards. A screenshot alone does not prove interaction behavior.
- Proposals and presentations use their dedicated standards. Their detailed rules are linked from [engineering standards](engineering-standards.md) rather than repeated here.
- Before a deployment, record project ID, environment, approved target, provider, service, secret reference identifier, identity-file validation, boundary validation, actual health-check command/result, and release revision. Never record secret values or prefill a deployment audit with successful states.

## Migration from earlier defaults

This baseline replaces this document's guaranteed zero-defect claims, prefilled successful deployment example, per-fix mandatory release upload, and duplicated proposal/UI design rules under the control-plane decision `ADR-0029-versioned-engineering-governance`. Applicable requirements now have explicit evidence and blocking states; product-specific quality mandates remain in force. Required complete application/device acceptance still runs before release even when a small inner-loop iteration used targeted checks.

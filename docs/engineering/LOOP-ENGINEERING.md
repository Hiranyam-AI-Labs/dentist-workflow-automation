# Loop engineering entry point — dentist-workflow-automation

Baseline: `2026.11.13.1`. This is a stable entry point; keep change-specific evidence in the active OpenSpec change or `docs/engineering/iterations/` so baseline upgrades cannot overwrite the history.

| Step | Required record |
| --- | --- |
| Sense | User goal, current revision, dirty-worktree boundaries, relevant requirements, applicable capabilities and known failures. |
| Plan | Acceptance scenarios, existing component/command reuse, smallest change, security/privacy implications, and affected documentation/PDF inventory. |
| Mutate | Implement within this project's boundary; update function headers and explanations of decisions/data flow with code. |
| Verify | Exact command, environment/device, input revision or hash, exit code, outcome and redacted evidence path. |
| Reflect | Root cause and next hypothesis after failure; avoid rerunning an unchanged failing command without a reason. |
| Close | Record PASS/FAIL/BLOCKED/NOT APPLICABLE per gate; synchronize affected specs, manuals, PDFs and status, then commit/push/deploy within authorized scope. |

Use `docs/engineering/baseline/loop-engineering-standard.md` for the complete loop. Reuse evidence only when inputs and environment are unchanged; invalidate it when code, tests, dependencies, configuration or devices relevant to that check change. A generated document is not test evidence. An unavailable device, service or credential is BLOCKED, never PASS. Log only minimized, redacted operational evidence.

Each iteration should leave a resumable checkpoint: active change path; completed acceptance criteria and evidence; remaining failures/blockers; next command; and any decision needing the owner. This makes the next agent continue the work without asking the user to repeat the project instructions.

Powered by Hiranyam AI Labs

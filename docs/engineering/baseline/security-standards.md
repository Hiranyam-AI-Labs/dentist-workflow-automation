# Security and UAT/production release gates

Baseline **2026.11.11.1** | Effective **2026-11-11**. The user requires security issues to be fixed before UAT or production deployment. Every release must complete all applicable security layers below. Required missing scans, unresolved findings and unknown coverage block deployment.

## Required scan coverage

| Layer | Free/open-source scanner or verification | Required evidence |
| --- | --- | --- |
| Application dependencies and lockfiles | OSV-Scanner (Apache-2.0), Trivy (Apache-2.0); ecosystem-native audit where supported | All shipped manifests/locks covered; CVE/GHSA/OSV IDs, affected/fixed versions and resolution |
| Container image and OS packages | Trivy image; Grype (Apache-2.0) as an independent cross-check for container releases | Exact immutable image digest, package inventory, current vulnerability database and zero unresolved findings |
| Infrastructure/container configuration | Trivy misconfiguration scanner; project policy checks | Docker/IaC/configuration scope, findings and tested corrections |
| Secrets and privacy | Gitleaks CLI (MIT), scoped project privacy checks | Redacted findings; no live secrets or unconsented sensitive records; credential rotation when exposure is confirmed |
| Source/application weaknesses | Project-native static analysis plus threat-based tests | Injection, XSS, authorization, tenant separation, file upload, SSRF, business logic and crypto checks appropriate to the app |
| Running web/API | OWASP ZAP (Apache-2.0) against an authorized isolated test instance, authenticated where needed | Recorded scope/context, endpoints/roles covered, alerts resolved and manual validation |
| Host/platform/TLS | Authorized host package/configuration audit and declared TLS/security checks | Host/runtime versions, patch state, network exposure and identity-bound evidence |
| Artifact inventory and license | SBOM (CycloneDX/SPDX using suitable OSS tooling), pinned dependency/license review | SBOM tied to release digest; no prohibited license/service requirements |

Use complementary scanners for applicable layers. One scanner does not cover every ecosystem, custom business rule or deployment configuration. Discover coverage gaps explicitly; never report “all CVEs fixed” from a subset of manifests or an empty unsupported scan.

## Blocking policy for both UAT and production

- Resolve **all confirmed applicable findings at every severity**, including low/unknown severity, before release. Do not lower a threshold, add `--ignore-unfixed`, blanket-ignore a directory, disable a detector, or hide an advisory to make a gate green.
- A confirmed finding without an available patch remains blocking. Evaluate a compatible upgrade, replacement, removal, or independently verified corrective design. Temporary mitigation is recorded as mitigation, not a fictitious fix or automatic release approval.
- A suspected false positive or “not affected” advisory needs explicit technical evidence bound to the exact release artifact and independent review. It is not silently counted as fixed. Preserve the decision and rationale; unresolved applicability remains blocking.
- Rebuild and rerun the affected functional, regression and security checks after remediation. Re-scan the final release image/artifact, not an earlier source directory or image tag.
- Missing scanners, failed database downloads, stale advisory data, parse errors, timeouts, unsupported manifests, disabled rules, missing authenticated test coverage or unavailable test instances are `BLOCKED`, never `PASS`.
- Security evidence records scanner/version, configuration/rule hashes, advisory database timestamp, source revision/input hash, immutable artifact digest, environment, UTC scan time, coverage, exit code, findings and post-fix outcome. Re-run if code, dependencies, image, configuration or relevant advisories change.
- Deployment scripts and CI must consume a complete matching gate result and fail closed before the remote mutation step. Do not deploy first and scan later. A report file's existence is not a release authorization.

The control-plane `run-security-gate.py` collects the implemented core scanner checks. Its report explicitly records additional required coverage and does not authorize deployment on its own. Each deployable child must implement and test its complete project-local release gate; installing governance documents alone cannot enforce every existing deployment script.

## Safe execution and findings

Run local scans in the selected repository with synthetic data. Active ZAP scans can change application state; use a declared isolated test instance and scoped authorization, never an arbitrary URL inferred from a prompt. Keep raw scanner outputs private and ephemeral because they can contain code snippets, requests or secret material. Persist sanitized finding IDs, locations, counts and hashes only.

Use project-isolated credential references and [credential isolation](credential-isolation-standards.md). Never read a sibling's secrets. Protect application containers with least privilege, scoped filesystem/network access and non-root execution. Database identities must be scoped to the project and role; use parameterized queries, authorization and authenticated encryption where required.

On confirmed exposure, stop affected processing/publication, revoke or rotate the credential through the declared project owner, assess impact and preserve sanitized incident evidence. Do not purge unrelated data or rewrite Git history automatically; recovery/history changes require their own scoped plan and verification.

## Current maintenance versus release claims

Governance maintenance verifies its changed code/docs and scanner behavior with fixtures. It does not certify all client dependencies or production servers. If scanners or running targets are unavailable, record those exact release blockers. Do not weaken gates to close a documentation task or claim a portfolio-wide security pass from historical reports.

## Official sources

- [Trivy filesystem coverage](https://trivy.dev/docs/latest/target/filesystem/) and [license](https://github.com/aquasecurity/trivy/blob/main/LICENSE)
- [OSV-Scanner](https://google.github.io/osv-scanner/) and [license](https://github.com/google/osv-scanner/blob/main/LICENSE)
- [Grype scanner and license](https://github.com/anchore/grype)
- [ZAP full-scan behavior and warning defaults](https://www.zaproxy.org/docs/docker/full-scan/) and [license](https://github.com/zaproxy/zaproxy/blob/main/LICENSE)
- [Gitleaks CLI and redaction](https://github.com/gitleaks/gitleaks)

Interpret tool exit codes and actual findings. In particular, default scanner warnings are not acceptance, and a clean scan is bounded evidence rather than proof that no vulnerability exists.

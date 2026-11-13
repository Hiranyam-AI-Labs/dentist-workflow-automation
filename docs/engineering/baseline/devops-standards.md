# Deployment and operations standards

Baseline **2026.11.11.1**. Deployment is a capability invoked by an authorized release/deploy request. Documentation or governance synchronization never deploys a product.

## Project and environment identity

Use the project's declared server identity and [credential-isolation standard](credential-isolation-standards.md). The control plane can consult its sanitized server registry; each child must carry its own complete deployment inputs and script. Never read a sibling's `.env`, key material, scripts or assets.

The selected identity must declare project ID, environment, enabled status, host, provider, service, domains, network, ports and credential reference names. A shared historical IP or a remembered port is not authoritative. An absent identity or disabled production environment is `BLOCKED`. Resolve only the declared environment's key-path or secret reference; never use a shared master password or cross-project fallback chain.

Display the project, environment, host, service and credential **reference name** before remote actions. Never display credential values. Existing task authorization remains valid; an identity summary is evidence of the selected target, not a repeated approval ritual.

## Self-contained pipeline

Every deployable project owns `scripts/deploy-hostinger.ps1` (or its existing documented deployment entry point), `.env.deployment.example` with reference-only examples, and a reproducible build configuration. Keep images, scripts, templates and SQL in their standard directories. Pin dependencies and image versions; do not assume a mutable latest image is a release.

For a declared Hostinger Docker Swarm/Traefik environment, maintain the project's own service on its declared overlay network, TLS route in `/etc/easypanel/traefik/config/<service-name>.yaml`, release image, resource bounds, health endpoint and rollback version. Use `start-first` updates when capacity and application readiness permit; measure service availability instead of promising zero downtime from a flag alone. Export the required static hosting archive when the product supports static export.

## Release loop

1. Verify selected repository, intended diff, environment, required access and enabled identity.
2. Run affected build/test/security gates. Before **either UAT or production**, enforce the [security release standard](security-standards.md): all applicable dependency/CVE, image/OS, secret, configuration, source, DAST and host checks must have current release-bound evidence and zero unresolved confirmed findings at every severity. Missing checks block remote mutation. Complete applicable mobile/visual checks and current handover/PDF outputs before release claims.
3. Build an immutable release and record its version/hash. Preserve rollback inputs; forward-only migrations require a recovery plan.
4. Transfer and update only the declared service. Do not remove unrelated containers, routes, databases or volumes.
5. Observe container health, public HTTPS routing, TLS and critical product flows. Record time, version, sanitized evidence and actual response.
6. If checks fail, stop promotion and apply the documented scoped rollback. Record rollback evidence and residual issues.

The loop log records performed deployment actions, target identity, reference names, build/test outcomes, release and health evidence. If remote verification cannot run, record `BLOCKED` or `NOT_RUN`; do not infer deployment from archive generation or a successful local build.

## Universal Strict Environment Isolation & Deployment Safety Protocol (P0 Rule 32)

Every model, agent, orchestrator, and engineer across all Hiranyam AI and client projects MUST strictly enforce this deployment protocol:

1. **Absolute Prohibition of Direct-to-Production Push or Deployment**:
   - **NEVER** push code, trigger builds, execute database migrations, or deploy changes directly to any production server, domain, or live cluster (`production` host / environment) without staging/UAT verification.
   - Direct-to-production pushes without preceding UAT testing are classified as critical P0 architectural violations.
2. **Mandatory Testing / UAT Server Staging**:
   - Every code change, patch, feature, and configuration update MUST first be deployed exclusively to the designated testing or UAT environment (e.g. UAT host, test container, staging URL).
3. **Exhaustive UAT Regression & QA Gate**:
   - Once running on the UAT server, execute full automated regression testing and comprehensive manual QA validation across primary and adjacent workflows before proceeding.
4. **Explicit Manual Client Approval Requirement**:
   - Zero production deployments are permitted based solely on automated passes or agent discretion. Deliver a concise UAT test report to the user/client, and proceed to production deployment ONLY after explicit written manual approval.

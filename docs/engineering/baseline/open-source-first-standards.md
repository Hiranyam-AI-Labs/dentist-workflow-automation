# Free and open-source tooling policy

Baseline **2026.11.11.1**. The user requires free/open-source tooling and no new paid software, commercial licenses or proprietary paywalled services. The [toolchain checklist](toolchain-and-capability-standard.md) records evaluated options and official license sources.

For a new dependency, record the exact edition/version, source URL, license, transitive obligations, compatibility and intended use. Preserve required attribution. Self-hosted, source-visible, free-tier and community-branded are not sufficient license evidence. Avoid paid-only features in required user flows and build/release checks.

Select tools for actual project needs. Existing compatible pinned tooling remains preferred over replacing it merely to make a portfolio uniform. Preserve data portability and project isolation. Core business rules must remain testable without a proprietary hosted service.

Historical registries describe existing vendor integrations; they do not authorize adding paid APIs or represent a license audit. In particular, do not label source-available workflow platforms as unrestricted open source. If an existing requirement depends on an excluded service, record the conflict and an evaluated compatible FOSS alternative before changing the architecture. Do not break existing integrations or silently migrate customer data during governance maintenance.

CMS selection distinguishes self-hosted open-source core/community features from enterprise plugins and cloud offerings. UI selection distinguishes the open-source component repository from similarly named commercial kits. Recheck the pinned version's license and maintenance/security status when adopting or upgrading.

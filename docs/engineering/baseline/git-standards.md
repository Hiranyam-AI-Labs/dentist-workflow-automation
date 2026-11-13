# Git & Version Control Standards

## 1. Conventional Commits
- Format: <type>(<scope>): <description>.
- Commit atomically (one logical feature or fix per commit).
- Never commit secrets or build artifacts.

## 2. Branch Hygiene
- main or master is stable production branch.
- Feature branches named eat/<feature-name> or ix/<bug-name>.
- Never force-push to shared or production branches.

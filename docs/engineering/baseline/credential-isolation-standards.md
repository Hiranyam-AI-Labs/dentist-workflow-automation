# Project-Specific Credential & Server Isolation Standards (P0 Rule 30)

> **Universal Infrastructure Security & Credential Boundary Standard across all 500+ Hiranyam AI Labs Projects.**

---

## 1. The Golden Rule

> **"One project. One server. One credential set. Never mixed. Never assumed. Always declared."**

At Hiranyam AI Labs, software development and autonomous deployment scale to hundreds of client initiatives simultaneously. Under no circumstances may an agent, developer, or automated pipeline mix, reuse, or guess credentials across project boundaries. 

Targeting the wrong server during deployment causes catastrophic damage: overwriting live production applications, wiping customer databases, leaking client secrets, and causing reputational ruin. This standard establishes strict physical and logical isolation boundaries that must be honored without exception.

---

## 2. Server Identity File Specification (`server-identity.yaml`)

Every project workspace under Hiranyam AI Labs MUST include an authoritative `server-identity.yaml` located in its client metadata directory:
`clients/<client-id>/server-identity.yaml`

### Authoritative YAML Schema
```yaml
# ═══════════════════════════════════════════════════════════════════
# HIRANYAM AI LABS — PROJECT SERVER IDENTITY SPECIFICATION
# ADR-0027 / P0 Rule 30 Standard
# ═══════════════════════════════════════════════════════════════════
# CRITICAL NOTICE:
# DO NOT COMMIT RAW PASSWORDS, PRIVATE KEYS, OR API SECRETS HERE.
# Store REFERENCE IDENTIFIERS only (e.g. environment variable names,
# path references to local keyfiles).
# ═══════════════════════════════════════════════════════════════════

project_id: "<client-slug>"                  # Authoritative client slug (e.g., hemkar-realty)
project_name: "<Human Readable Name>"        # Display name (e.g., Hemkar Realty)
client_tier: "enterprise"                    # internal | pilot | enterprise | government

environments:
  dev:
    enabled: true
    provider: "hostinger-vps"                 # hostinger-vps | godaddy-vps | aws-ec2 | azure-vm | custom
    host: "72.62.198.241"                     # Shared Hiranyam Dev/Test VPS (Internal Dev ONLY)
    ssh_port: 22
    ssh_user: "root"
    ssh_key_ref: "env:HIRANYAM_DEV_SSH_KEY"   # REFERENCE ONLY — never raw key material
    ssh_password_ref: "env:HIRANYAM_DEV_SSH_PASSWORD"
    docker_network: "easypanel"
    traefik_subdomain: "<client-slug>.bjttvo.easypanel.host"
    service_name: "<service-name>"
    direct_port: 3000
    container_port: 80

  staging:
    enabled: false
    provider: "<provider>"
    host: "<STAGING_HOST_OR_IP>"
    ssh_port: 22
    ssh_user: "root"
    ssh_key_ref: "env:<CLIENT_ID_UPPER>_STAGING_SSH_KEY"
    ssh_password_ref: "env:<CLIENT_ID_UPPER>_STAGING_SSH_PASSWORD"
    domain: "staging.<clientdomain>.com"
    service_name: "<service-name>-staging"
    direct_port: 3000

  production:
    enabled: false                           # MUST be explicitly set to true when client server is active
    provider: "<provider>"                   # hostinger-vps | godaddy-vps | aws-ec2 | azure-vm | custom
    host: "<DEDICATED_PROD_HOST_OR_IP>"      # NEVER the shared Hiranyam dev VPS
    ssh_port: 22
    ssh_user: "root"
    ssh_key_ref: "env:<CLIENT_ID_UPPER>_PROD_SSH_KEY"
    ssh_password_ref: "env:<CLIENT_ID_UPPER>_PROD_SSH_PASSWORD"
    domain: "<production-domain.com>"
    service_name: "<service-name>"
    direct_port: 80
    container_port: 80
    notes: "Dedicated client production instance."

databases:
  primary:
    engine: "postgresql"                     # postgresql | mysql | sqlite | mongodb
    host_ref: "internal"                     # internal container or dedicated host IP
    port: 5432
    db_name: "<client_db_name>"
    user_ref: "env:<CLIENT_ID_UPPER>_DB_USER"
    password_ref: "env:<CLIENT_ID_UPPER>_DB_PASSWORD"

credential_guard:
  require_confirmation_before_deploy: true
  block_if_missing_server_identity: true
  allow_shared_dev_vps_for_production: false  # STRICT ENFORCEMENT: Shared dev VPS blocked for production
```

---

## 3. How AI Agents MUST Behave

Whenever an AI coding assistant, autonomous agent, or deployment engineer is prompted to build, verify, or deploy a client workload:

```text
Step 1: Check Central Registry (registry/server-registry.yaml)
        ↓ Look up project_id entry and verified provider topology.
Step 2: Read Project Server Identity (clients/<client-id>/server-identity.yaml)
        ↓ Per-project declaration takes precedence.
Step 3: Verify Target Environment (dev / staging / production)
        ↓ If target is 'production' and 'enabled: false':
          → HALT IMMEDIATELY. Report to user: 
            "Production server has not been configured/enabled for <project-id>. Deployment halted."
Step 4: Resolve Credential References
        ↓ Extract only declared env variables (e.g. $env:HEMKAR_PROD_SSH_PASSWORD).
        ↓ NEVER read or harvest credentials from sibling project folders.
Step 5: Output Mandatory Confirmation Header
        ↓ Render visual verification banner for user safety.
Step 6: Execute Remote Operation (Deploy, Container Update, or Health Probe)
Step 7: Log Execution in LOOP-ENGINEERING.md
        ↓ Record target host, environment, credential reference used, and verification result.
```

---

## 4. What an Agent Must NEVER Do

1. **NEVER Fall Back to Shared Dev VPS for Production**: Do not deploy production builds to `72.62.198.241` unless the project IS Hiranyam AI Labs internal infrastructure itself.
2. **NEVER Read Sibling Secrets**: Never inspect `.env`, `.env.deployment`, `.secrets/`, or config files in sibling folders (e.g. reading from `GranoSatva` while deploying `HemkarRealty`).
3. **NEVER Guess Passwords or Ports**: If an SSH host, port, or password is unknown, STOP. Ask the user:
   > *"I cannot find the server identity for project <client-id>. Please specify the server host IP, provider (Hostinger / GoDaddy / AWS / Custom VPS), and credential reference."*
4. **NEVER Store Raw Secrets in Version Control**: Never write actual passwords, private SSH key content, or bearer tokens into Git commits or YAML registers.
5. **NEVER Proceed Without Confirmation Header**: Always display the deployment summary header prior to executing remote network calls.

---

## 5. Credential Naming Convention

All environment variables used to supply runtime credentials MUST follow this project-isolated naming schema:

$$\mathbf{\langle PROJECT\_ID\_UPPERCASE\rangle\_\langle ENVIRONMENT\rangle\_\langle CREDENTIAL\_TYPE\rangle}$$

### Standardized Variable Tokens
| Pattern | Example | Purpose |
| :--- | :--- | :--- |
| `<PROJECT>_<ENV>_SSH_PASSWORD` | `HEMKAR_PROD_SSH_PASSWORD` | SSH login password for production host |
| `<PROJECT>_<ENV>_SSH_KEY` | `HEMKAR_PROD_SSH_KEY` | Path to private SSH key file |
| `<PROJECT>_<ENV>_DB_PASSWORD` | `HEMKAR_PROD_DB_PASSWORD` | Database connection password |
| `<PROJECT>_<ENV>_API_KEY` | `HEMKAR_PROD_API_KEY` | External service integration token |
| `<PROJECT>_<ENV>_HOST` | `HEMKAR_PROD_HOST` | Custom host IP override |

By embedding the project slug directly into the variable name, accidental credential substitution between projects becomes instantly visible and auditable.

---

## 6. Provider-Specific Architecture Notes

### 6.1 Hostinger VPS
- Standard access via SSH (`root` or non-root deployer user).
- Traefik reverse proxy configuration located at `/etc/easypanel/traefik/config/<service-name>.yaml`.
- Docker Swarm service deployment with rolling zero-downtime updates (`--update-order start-first`).
- Each client on Hostinger must have their own VPS instance or an isolated cluster tenant.

### 6.2 GoDaddy VPS
- SSH access with key pair or root password.
- Standalone Docker or NGINX reverse proxy configurations.
- Separate firewall security groups ensuring ports 22, 80, 443 are properly bound.

### 6.3 Cloud Providers (AWS EC2 / Azure VM / Google Cloud Compute)
- Identity key pairs (`.pem` / `.id_rsa`) stored in user's secure directory (`~/.ssh/<project>_prod.pem`).
- Strict IAM roles and security group ingress rules restricting administrative ports.

### 6.4 Private VPN / On-Premise VPS
- Dedicated wireguard or openvpn gateway tunnels.
- Server identity file must document target local CIDR and gateway host in `notes`.

---

## 7. Incident Handling & Remediation Protocol

If an agent or human operator inadvertently initiates a deployment using incorrect credentials or targeting an unintended server:

1. **Immediate Execution Abort**: Terminate the deployment process immediately via `kill` or `Ctrl+C`.
2. **Target State Assessment**: Inspect the affected remote server to verify if services, containers, or databases were modified.
3. **Rollback & Restore**:
   - Revert Docker service to prior timestamped image (`docker service update --image <service>:<prior-timestamp>`).
   - Restore database from snapshot if migrations were executed.
4. **Security Audit**: Scan commit history to ensure no sensitive credentials were committed.
5. **Post-Incident Log**: Document the root cause in `LOOP-ENGINEERING.md` under Section 4 with remediation actions.

<#
.SYNOPSIS
    Deploy Dentist Workflow Automation Platform to Hostinger Production VPS.
.DESCRIPTION
    Automated remote deployment pipeline for Hostinger VPS (72.62.198.241).
    Packages the application, uploads via SSH, builds the Docker Swarm service,
    and binds EasyPanel Traefik reverse proxy with automated Let's Encrypt SSL.
.PARAMETER HostName
    The target Hostinger VPS IP or hostname. Default: 72.62.198.241.
.PARAMETER PublicHost
    Primary public domain name configured in EasyPanel Traefik. Default: dentist-ai.bjttvo.easypanel.host.
.PARAMETER ServiceName
    Docker Swarm service name. Default: dentist-ai-automation.
.PARAMETER Port
    Direct service port. Default: 5055.
.PARAMETER IdentityFile
    SSH private key path. Default: $env:USERPROFILE\.ssh\dg_online_hostinger.
#>
param(
    [Parameter(Mandatory = $false)]
    [string]$HostName = "72.62.198.241",

    [Parameter(Mandatory = $false)]
    [string]$PublicHost = "dentist-ai.bjttvo.easypanel.host",

    [Parameter(Mandatory = $false)]
    [string]$AltHost = "dentist.bjttvo.easypanel.host",

    [Parameter(Mandatory = $false)]
    [string]$ServiceName = "dentist-ai-automation",

    [Parameter(Mandatory = $false)]
    [int]$Port = 5055,

    [Parameter(Mandatory = $false)]
    [string]$IdentityFile = "$env:USERPROFILE\.ssh\dg_online_hostinger",

    [Parameter(Mandatory = $false)]
    [string]$Password = "",

    [Parameter(Mandatory = $false)]
    [string]$PasswordFile = "",

    [Parameter(Mandatory = $false)]
    [string]$EnvFile = ""
)

$ErrorActionPreference = "Stop"

function Write-PipelineBanner {
    param([string]$TargetHost, [string]$TargetDomain, [int]$TargetPort)
    Write-Host "`n=================================================================" -ForegroundColor Cyan
    Write-Host "  DENTIST WORKFLOW AUTOMATION -- HOSTINGER VPS DEPLOYMENT PIPELINE" -ForegroundColor Yellow
    Write-Host "  Target VPS: root@$TargetHost (Port: $TargetPort | Domain: https://$TargetDomain)" -ForegroundColor Cyan
    Write-Host "=================================================================`n" -ForegroundColor Cyan
}

Write-PipelineBanner -TargetHost $HostName -TargetDomain $PublicHost -TargetPort $Port

# -----------------------------------------------------------------------------
# Phase 1: Package Release Artifact
# -----------------------------------------------------------------------------
$release = (Get-Date).ToUniversalTime().ToString("yyyyMMddTHHmmssZ")
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$stage = Join-Path $env:TEMP "dentist-deploy-stage-$release"
$archive = Join-Path $env:TEMP "dentist-ai-automation-$release.tar.gz"
$askpass = $null

Write-Host "[1/4] Packaging Clean Production Archive ($release)..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path $stage -Force | Out-Null

Copy-Item -Path (Join-Path $projectRoot "src") -Destination (Join-Path $stage "src") -Recurse -Force
Copy-Item -Path (Join-Path $projectRoot "public") -Destination (Join-Path $stage "public") -Recurse -Force
Copy-Item -Path (Join-Path $projectRoot "package*.json") -Destination $stage -Force
Copy-Item -Path (Join-Path $projectRoot "Dockerfile") -Destination $stage -Force
Copy-Item -Path (Join-Path $projectRoot "docker-compose.yml") -Destination $stage -Force
Copy-Item -Path (Join-Path $projectRoot ".env.example") -Destination (Join-Path $stage ".env") -Force

tar -czf $archive -C $stage .
Write-Host "  [OK] Release archive generated: $archive" -ForegroundColor Green

# -----------------------------------------------------------------------------
# Phase 2: Resolve Authentication (SSH Key or SSH_ASKPASS Password)
# -----------------------------------------------------------------------------
Write-Host "`n[2/4] Resolving Secure SSH Authentication for root@$HostName..." -ForegroundColor Cyan

$useKey = Test-Path -LiteralPath $IdentityFile

if ($useKey) {
    Write-Host "  [AUTH] Using SSH Key: $IdentityFile" -ForegroundColor Green
    $sshOpts = @("-o", "StrictHostKeyChecking=accept-new", "-i", $IdentityFile)
    $scpOpts = @("-o", "StrictHostKeyChecking=accept-new", "-i", $IdentityFile)
} else {
    $resolvedPassword = $Password

    if ([string]::IsNullOrWhiteSpace($resolvedPassword) -and -not [string]::IsNullOrWhiteSpace($env:HOSTINGER_SSH_PASSWORD)) {
        $resolvedPassword = $env:HOSTINGER_SSH_PASSWORD
    }
    if ([string]::IsNullOrWhiteSpace($resolvedPassword) -and -not [string]::IsNullOrWhiteSpace($env:KS_HOSTINGER_PASSWORD)) {
        $resolvedPassword = $env:KS_HOSTINGER_PASSWORD
    }
    if ([string]::IsNullOrWhiteSpace($resolvedPassword) -and -not [string]::IsNullOrWhiteSpace($env:NM_HOSTINGER_PASSWORD)) {
        $resolvedPassword = $env:NM_HOSTINGER_PASSWORD
    }
    if ([string]::IsNullOrWhiteSpace($resolvedPassword) -and -not [string]::IsNullOrWhiteSpace($PasswordFile) -and (Test-Path $PasswordFile)) {
        $resolvedPassword = (Get-Content -Raw -LiteralPath $PasswordFile).Trim()
    }
    if ([string]::IsNullOrWhiteSpace($resolvedPassword) -and -not [string]::IsNullOrWhiteSpace($EnvFile) -and (Test-Path $EnvFile)) {
        Get-Content $EnvFile | ForEach-Object {
            if ($_ -match "^\s*HOSTINGER_SSH_PASSWORD\s*=\s*(.*)$") {
                $resolvedPassword = $matches[1].Trim()
            }
        }
    }

    if ([string]::IsNullOrWhiteSpace($resolvedPassword)) {
        Write-Host "  [PROMPT] Enter Hostinger VPS SSH Password for root@$HostName (or set `$env:HOSTINGER_SSH_PASSWORD):" -ForegroundColor Yellow
        $secPass = Read-Host -AsSecureString
        $resolvedPassword = [System.Net.NetworkCredential]::new("", $secPass).Password
    }

    if ([string]::IsNullOrWhiteSpace($resolvedPassword)) {
        throw "No SSH credentials supplied. Provide -IdentityFile, -Password, or set `$env:HOSTINGER_SSH_PASSWORD."
    }

    $askpass = Join-Path $env:TEMP "dentist-ssh-askpass-$release.bat"
    Set-Content -LiteralPath $askpass -Value "@echo off`necho $resolvedPassword" -Encoding Ascii
    $env:SSH_ASKPASS = $askpass
    $env:SSH_ASKPASS_REQUIRE = "force"
    $env:DISPLAY = "codex"

    $sshOpts = @("-o", "StrictHostKeyChecking=accept-new", "-o", "PreferredAuthentications=password", "-o", "PubkeyAuthentication=no")
    $scpOpts = @("-o", "StrictHostKeyChecking=accept-new", "-o", "PreferredAuthentications=password", "-o", "PubkeyAuthentication=no")
    Write-Host "  [AUTH] Non-interactive password authentication configured via SSH_ASKPASS." -ForegroundColor Green
}

try {
    # -------------------------------------------------------------------------
    # Phase 3: Upload Release Archive to Hostinger VPS
    # -------------------------------------------------------------------------
    Write-Host "`n[3/4] Uploading Release Archive to Hostinger VPS ($HostName)..." -ForegroundColor Cyan
    & scp.exe @scpOpts $archive "root@${HostName}:/tmp/dentist-ai-automation-$release.tar.gz"
    Write-Host "  [OK] Release archive uploaded successfully." -ForegroundColor Green

    # -------------------------------------------------------------------------
    # Phase 4: Execute Remote Build, Swarm Service Update, and Traefik Route
    # -------------------------------------------------------------------------
    Write-Host "`n[4/4] Building Docker Container & Updating Swarm Service..." -ForegroundColor Cyan
    $remoteScript = @"
set -eu
mkdir -p /opt/${ServiceName}/releases/${release}
tar -xzf /tmp/dentist-ai-automation-${release}.tar.gz -C /opt/${ServiceName}/releases/${release}
cd /opt/${ServiceName}/releases/${release}
docker build -t ${ServiceName}:${release} .

# Ensure external network easypanel exists
docker network inspect easypanel >/dev/null 2>&1 || docker network create --driver overlay --attachable easypanel

if docker service inspect ${ServiceName} >/dev/null 2>&1; then
  echo "Updating existing service ${ServiceName}..."
  docker service update --image ${ServiceName}:${release} --update-order start-first ${ServiceName}
else
  echo "Creating new Docker Swarm service ${ServiceName} on network easypanel..."
  docker service create \
    --name ${ServiceName} \
    --network easypanel \
    --publish mode=ingress,published=${Port},target=5055 \
    --replicas 1 \
    --restart-condition any \
    --update-order start-first \
    --limit-memory 384M \
    --reserve-memory 64M \
    ${ServiceName}:${release}
fi

rm -f /tmp/dentist-ai-automation-${release}.tar.gz
echo "=== Docker Service PS ==="
docker service ps ${ServiceName} --format 'table {{.Name}}\t{{.CurrentState}}\t{{.Error}}'
"@

    & ssh.exe @sshOpts "root@$HostName" $remoteScript

    # Upload Traefik routing configuration to Hostinger VPS via SCP
    $traefikConfigPath = Join-Path $PSScriptRoot "dentist-ai-automation.yaml"
    Write-Host "`nUploading Traefik routing configuration to Hostinger VPS..." -ForegroundColor Cyan
    & scp.exe @scpOpts $traefikConfigPath "root@${HostName}:/etc/easypanel/traefik/config/${ServiceName}.yaml"
    Write-Host "  [OK] Traefik routing configuration active." -ForegroundColor Green

    Write-Host "`n=================================================================" -ForegroundColor Green
    Write-Host "  DENTIST AUTOMATION DEPLOYMENT COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host "  Primary HTTPS URL:  https://$PublicHost" -ForegroundColor Green
    Write-Host "  Alternative HTTPS:  https://$AltHost" -ForegroundColor Green
    Write-Host "  Direct VPS URL:     http://${HostName}:${Port}" -ForegroundColor Green
    Write-Host "  Health Probe:       https://${PublicHost}/health" -ForegroundColor Green
    Write-Host "=================================================================`n" -ForegroundColor Green
}
finally {
    if ($askpass -and (Test-Path $askpass)) {
        Remove-Item -LiteralPath $askpass -Force -ErrorAction SilentlyContinue
    }
    Remove-Item -LiteralPath $archive -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $stage -Recurse -Force -ErrorAction SilentlyContinue
}

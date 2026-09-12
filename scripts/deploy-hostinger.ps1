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
    [string]$HostName = "72.62.198.241",
    [string]$PublicHost = "dentist-ai.bjttvo.easypanel.host",
    [string]$AltHost = "dentist.bjttvo.easypanel.host",
    [string]$ServiceName = "dentist-ai-automation",
    [int]$Port = 5055,
    [string]$IdentityFile = "$env:USERPROFILE\.ssh\dg_online_hostinger"
)

$ErrorActionPreference = "Stop"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  DENTIST WORKFLOW AUTOMATION -- HOSTINGER VPS DEPLOYMENT PIPELINE" -ForegroundColor Yellow
Write-Host "  Target VPS: root@$HostName (Port: $Port | Domain: https://$PublicHost)" -ForegroundColor Cyan
Write-Host "=================================================================`n" -ForegroundColor Cyan

# 1. Prepare Release Archive
$release = (Get-Date).ToUniversalTime().ToString("yyyyMMddTHHmmssZ")
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$stage = Join-Path $env:TEMP "dentist-deploy-stage-$release"
$archive = Join-Path $env:TEMP "dentist-ai-automation-$release.tar.gz"

Write-Host "[1/4] Packaging Clean Release Archive ($release)..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path $stage -Force | Out-Null

Copy-Item -Path (Join-Path $projectRoot "src") -Destination (Join-Path $stage "src") -Recurse -Force
Copy-Item -Path (Join-Path $projectRoot "public") -Destination (Join-Path $stage "public") -Recurse -Force
Copy-Item -Path (Join-Path $projectRoot "package*.json") -Destination $stage -Force
Copy-Item -Path (Join-Path $projectRoot "Dockerfile") -Destination $stage -Force
Copy-Item -Path (Join-Path $projectRoot "docker-compose.yml") -Destination $stage -Force
Copy-Item -Path (Join-Path $projectRoot ".env.example") -Destination (Join-Path $stage ".env") -Force

tar -czf $archive -C $stage .
Write-Host "  [OK] Release archive generated: $archive" -ForegroundColor Green

# 2. Check SSH Authentication
$hasKey = Test-Path -LiteralPath $IdentityFile
if (-not $hasKey) {
    Write-Host "`n[NOTICE] SSH identity key not found at $IdentityFile." -ForegroundColor Yellow
    Write-Host "If you have the Hostinger SSH password or root key, you can provide it or run with SSH agent." -ForegroundColor Yellow
    Write-Host "Archive is ready at: $archive" -ForegroundColor Cyan
    Write-Host "Direct deploy command:" -ForegroundColor Cyan
    Write-Host "scp $archive root@${HostName}:/tmp/" -ForegroundColor Gray
} else {
    Write-Host "`n[2/4] Uploading Release Archive to Hostinger VPS ($HostName)..." -ForegroundColor Cyan
    $scpOpts = @("-o", "StrictHostKeyChecking=accept-new", "-i", $IdentityFile)
    $sshOpts = @("-o", "StrictHostKeyChecking=accept-new", "-i", $IdentityFile)

    & scp @scpOpts $archive "root@${HostName}:/tmp/dentist-ai-automation-$release.tar.gz"

    Write-Host "`n[3/4] Building Docker Container & Updating Swarm Service..." -ForegroundColor Cyan
    $remoteScript = @"
set -eu
mkdir -p /opt/$ServiceName/releases/$release
tar -xzf /tmp/dentist-ai-automation-$release.tar.gz -C /opt/$ServiceName/releases/$release
cd /opt/$ServiceName/releases/$release
docker build -t $ServiceName:$release .

if docker service inspect $ServiceName >/dev/null 2>&1; then
  echo "Updating existing service $ServiceName..."
  docker service update --image $ServiceName:$release --update-order start-first $ServiceName
else
  echo "Creating new Docker Swarm service $ServiceName on network easypanel..."
  docker service create \
    --name $ServiceName \
    --network easypanel \
    --publish mode=ingress,published=$Port,target=5055 \
    --replicas 1 \
    --restart-condition any \
    --update-order start-first \
    --limit-memory 384M \
    --reserve-memory 64M \
    $ServiceName:$release
fi

cat > /etc/easypanel/traefik/config/$ServiceName.yaml <<'TRAEFIK_CFG'
http:
  routers:
    $ServiceName-http:
      rule: Host(`$PublicHost`) || Host(`$AltHost`)
      entryPoints: [http]
      middlewares: [redirect-to-https]
      service: $ServiceName
    $ServiceName-https:
      rule: Host(`$PublicHost`) || Host(`$AltHost`)
      entryPoints: [https]
      service: $ServiceName
      tls:
        certResolver: letsencrypt
  services:
    $ServiceName:
      loadBalancer:
        servers:
          - url: http://$ServiceName:5055
TRAEFIK_CFG

rm -f /tmp/dentist-ai-automation-$release.tar.gz
echo "Service Status:"
docker service ps $ServiceName --format '{{.Name}}|{{.CurrentState}}|{{.Error}}'
"@

    & ssh @sshOpts "root@$HostName" $remoteScript

    Write-Host "`n[4/4] DEPLOYMENT COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host "  Public Live URL:   https://$PublicHost" -ForegroundColor Green
    Write-Host "  Alternative URL:   https://$AltHost" -ForegroundColor Green
    Write-Host "  Direct VPS URL:    http://${HostName}:${Port}" -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Green
}

# Cleanup temporary packaging files
Remove-Item -LiteralPath $archive -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $stage -Recurse -Force -ErrorAction SilentlyContinue

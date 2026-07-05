#!/usr/bin/env bash
# Install a FORGE cron entry that auto-deploys echo-ept.com when main drifts ahead of prod.
set -euo pipefail

REPO="${EPT_REPO:-/home/forge/echo-prime-tech}"
CRON_MARK="# echo-ept.com deploy-if-stale watchdog"
CRON_LINE="*/15 * * * * cd ${REPO} && /usr/bin/node scripts/deploy-if-stale.mjs >> /var/log/echo-ept-deploy-watchdog.log 2>&1 ${CRON_MARK}"

if [[ ! -f "${REPO}/scripts/deploy-if-stale.mjs" ]]; then
  echo "ERROR: ${REPO}/scripts/deploy-if-stale.mjs not found" >&2
  exit 1
fi

chmod +x "${REPO}/scripts/install-deploy-watchdog.sh" 2>/dev/null || true

EXISTING=$(crontab -l 2>/dev/null || true)
if echo "${EXISTING}" | grep -qF "${CRON_MARK}"; then
  echo "Watchdog cron already installed."
  exit 0
fi

{
  echo "${EXISTING}"
  echo "${CRON_LINE}"
} | crontab -

echo "Installed cron (every 15 min): deploy-if-stale for ${REPO}"
echo "Log: /var/log/echo-ept-deploy-watchdog.log"
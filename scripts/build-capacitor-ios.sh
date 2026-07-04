#!/usr/bin/env bash
# Immortality Vault — Capacitor iOS build pipeline (FORGE, no Mac required for prep).
# Produces synced ios/ Xcode project ready for Codemagic / GitHub Actions macOS runner.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

VAULT_DB="${VAULT_DB:-/home/forge/master_vault.db}"

load_vault() {
  if [[ -f "$VAULT_DB" ]]; then
    export NEXT_PUBLIC_FIREBASE_API_KEY="${NEXT_PUBLIC_FIREBASE_API_KEY:-$(sqlite3 "$VAULT_DB" "SELECT secret FROM credentials WHERE service='generic_api' AND username='next_public_firebase_api_key' LIMIT 1;" 2>/dev/null || true)}"
    export NEXT_PUBLIC_FIREBASE_APP_ID="${NEXT_PUBLIC_FIREBASE_APP_ID:-$(sqlite3 "$VAULT_DB" "SELECT secret FROM credentials WHERE service='generic_api' AND username='expo_public_firebase_app_id' LIMIT 1;" 2>/dev/null || true)}"
  fi
}

echo "=== Immortality Vault Capacitor iOS Build ==="
load_vault

if [[ -z "${NEXT_PUBLIC_FIREBASE_API_KEY:-}" ]]; then
  echo "WARN: NEXT_PUBLIC_FIREBASE_API_KEY not set — static export may fail on Firebase pages"
fi

echo "[1/4] Next.js static export..."
npm run build

echo "[2/4] Prepare Capacitor export..."
node scripts/prepare-capacitor-export.js

echo "[3/4] Capacitor sync ios..."
if [[ ! -d ios ]]; then
  npx cap add ios
fi
npx cap sync ios
bash scripts/patch-ios-plist.sh

echo "[4/4] Verify ios/ project..."
test -f ios/App/App/Info.plist
test -f ios/App/App.xcodeproj/project.pbxproj

echo "=== BUILD READY ==="
echo "  Bundle ID: com.echoomegaprime.immortalityvault"
echo "  ASC App ID: 6757110323"
echo "  Team: W54TFAVXS2"
echo "  Web dir: out/ (entry: /immortality-vault/app.html)"
echo ""
echo "Cloud build: push to main → .github/workflows/immortality-vault-ios.yml"
echo "Local submit: cd ios/App && fastlane beta (requires ASC API key in vault)"
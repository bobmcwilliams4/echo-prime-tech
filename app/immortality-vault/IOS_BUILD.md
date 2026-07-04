# Immortality Vault — iOS App (Capacitor)

Native iOS wrapper around the **current** Next.js web app (`app/immortality-vault/app/`).
All 13 panels ship as the bundled static export — not the old Expo sovereign-app.

## Architecture

| Layer | Path | Role |
|-------|------|------|
| Web UI | `app/immortality-vault/app/` | 13 panels (Interview, Record, Chat, …) |
| API | `lib/constants.ts` → `https://vault-api.echo-op.com` | Sovereign FORGE backend |
| Native shell | `capacitor.config.ts` + `ios/` | WKWebView + Camera/Mic/Push |
| CI | `.github/workflows/immortality-vault-ios.yml` | macOS runner → TestFlight |

## App Store Connect

| Field | Value |
|-------|-------|
| Bundle ID | `com.echoomegaprime.immortalityvault` |
| ASC App ID | `6757110323` |
| Team ID | `W54TFAVXS2` |
| Apple ID | `echoprime76@icloud.com` |
| EAS owner | `echoprimeai` (legacy; Capacitor uses Fastlane) |

Submit uses **App Store Connect API key** (.p8), not password/2FA.
Credentials: vault `service=apple_developer user=echoprime76@icloud.com`.

## Build (FORGE — no Mac)

```bash
cd /home/forge/echo-prime-tech
bash scripts/build-capacitor-ios.sh
```

This runs:
1. `npm run build` — Next.js static export → `out/`
2. `scripts/prepare-capacitor-export.js` — sets `out/index.html` → vault app
3. `npx cap sync ios` — copies web assets into Xcode project

## Cloud Build → TestFlight

1. Set GitHub secrets: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_APP_ID`, `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_CONTENT` (base64 .p8)
2. Push to `main` (or `workflow_dispatch`)
3. Workflow builds on `macos-latest`, uploads via Fastlane `beta` lane

## Native Features

| Feature | Implementation |
|---------|----------------|
| Camera + mic | `lib/media.ts` + WKWebView getUserMedia + `@capacitor/camera` fallback |
| Push nudges (2×/day) | `@capacitor/push-notifications` → `POST /nudges/register-device` |
| Sign in with Apple | Firebase auth in WebView + `@capacitor-community/apple-sign-in` native fallback |
| Deep links | Push tap → `vault-navigate` event → panel switch |

## iOS Permissions (Info.plist)

Configured via Capacitor:
- `NSCameraUsageDescription` — Record life stories on camera
- `NSMicrophoneUsageDescription` — Voice clone and interview answers
- `NSPhotoLibraryUsageDescription` — Save recorded memories

## Verify

```bash
# Backend smoke (31 checks)
python3 /home/forge/echo-immortality-vault/smoke_test.py https://vault-api.echo-op.com

# Live web app
curl -sI https://echo-ept.com/immortality-vault/app | head -1

# Capacitor project integrity
test -f ios/App/App/Info.plist && echo OK
```

## Blockers (Commander-only)

- Physical iPhone for final device test report
- APNs key in Apple Developer portal (for push delivery beyond registration)
- ASC API key in GitHub secrets (one-time setup)
#!/usr/bin/env bash
# Re-apply iOS privacy permissions after `cap sync` (Capacitor may regenerate Info.plist).
set -euo pipefail
PLIST="ios/App/App/Info.plist"
if [[ ! -f "$PLIST" ]]; then exit 0; fi

# Only patch if camera key missing
if grep -q NSCameraUsageDescription "$PLIST" 2>/dev/null; then
  echo "Info.plist already patched"
  exit 0
fi

/usr/bin/python3 - <<'PY'
import plistlib, pathlib
p = pathlib.Path("ios/App/App/Info.plist")
with p.open("rb") as f:
    d = plistlib.load(f)
d["NSCameraUsageDescription"] = "Immortality Vault uses your camera to record life stories and video memories for your digital legacy."
d["NSMicrophoneUsageDescription"] = "Immortality Vault uses your microphone to capture interview answers and create your AI voice clone."
d["NSPhotoLibraryUsageDescription"] = "Immortality Vault saves recorded memories to your photo library when you choose to export them."
d["NSPhotoLibraryAddUsageDescription"] = "Immortality Vault can save your recorded video memories to your photo library."
d["UIBackgroundModes"] = ["remote-notification"]
with p.open("wb") as f:
    plistlib.dump(d, f)
print("Patched Info.plist with camera/mic/push permissions")
PY
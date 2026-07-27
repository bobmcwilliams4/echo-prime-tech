# Immortality Vault Journey Walk — 2026-07-27

Host: FORGE builder + CDP HeadlessChrome :9222
Test user: `ivtest_*` only (Auth-11 safe — no ECHO_CONSOLIDATED/personal)

| Step | Result | Evidence |
|------|--------|----------|
| 1. Sign-in UI | PASS | `/immortality-vault/login` shows email + Google/Apple/GitHub; wrong password → friendly error; unauth `/app` → redirect login |
| 2. Upload voice + video | PASS | POST `/voice/profiles`, `/video/upload` as Firebase custom-token test user |
| 3. Encrypt IVENC2 | PASS | on-disk files under `data/voice_samples/ivtest_*` and `data/videos/ivtest_*` start with `IVENC2` |
| 4. Playback 200/206 | PASS | `/video/stream/{id}?tok=` full 200 decrypt match + Range 206 `bytes 0-99/N` via vault-api.echo-op.com |
| 5. TTS non-silent | PASS | POST `/voice/synthesize` with `output_format=wav_44100`; ElevenLabs MP3 (local TTS degraded) non-zero energy |
| 6. Restore/listen | PASS | Browser open listen?token=… shows stories; POST `/listen/{token}/speak` from page context returns playable audio |

Screenshots: `/tmp/iv_step_signin.png`, `/tmp/iv_step_listen.png`
JSON: `/tmp/iv_journey_results.json`, `/tmp/iv_browser_steps.json`

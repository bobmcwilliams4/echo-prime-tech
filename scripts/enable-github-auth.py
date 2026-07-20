#!/usr/bin/env python3
"""Enable GitHub as a Firebase Auth sign-in provider for project echo-prime-ai.

The ONLY prerequisite is a GitHub OAuth App (github.com -> Settings ->
Developer settings -> OAuth Apps -> New OAuth App):
  Application name:  Immortality Vault (Firebase Auth)
  Homepage URL:      https://immortalityvault.app
  Callback URL:      https://echo-prime-ai.firebaseapp.com/__/auth/handler
Then generate a client secret and run:

  python scripts/enable-github-auth.py <CLIENT_ID> <CLIENT_SECRET>

Auth: uses the local gcloud login (needs cloud-platform scope on a principal
with Firebase Auth admin on echo-prime-ai). Idempotent: creates the
defaultSupportedIdpConfig if missing, patches it if it exists.
"""
import json
import subprocess
import sys
import urllib.error
import urllib.request

PROJECT = 'echo-prime-ai'
BASE = f'https://identitytoolkit.googleapis.com/admin/v2/projects/{PROJECT}/defaultSupportedIdpConfigs'


def token() -> str:
    return subprocess.check_output(
        ['gcloud', 'auth', 'print-access-token'], text=True, shell=(sys.platform == 'win32')
    ).strip()


def req(url: str, method: str = 'GET', body: dict | None = None):
    r = urllib.request.Request(
        url,
        data=json.dumps(body).encode() if body is not None else None,
        method=method,
        headers={
            'Authorization': 'Bearer ' + token(),
            'x-goog-user-project': PROJECT,
            'Content-Type': 'application/json',
        },
    )
    with urllib.request.urlopen(r) as resp:
        return json.load(resp)


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    client_id, client_secret = sys.argv[1], sys.argv[2]
    body = {'enabled': True, 'clientId': client_id, 'clientSecret': client_secret}
    try:
        out = req(f'{BASE}?idpId=github.com', 'POST', body)
        print('CREATED github.com provider:', out.get('name'))
    except urllib.error.HTTPError as e:
        if e.code == 409:
            out = req(
                f'{BASE}/github.com?updateMask=enabled,clientId,clientSecret', 'PATCH', body
            )
            print('UPDATED github.com provider:', out.get('name'))
        else:
            raise
    check = req(BASE)
    ok = any(
        c['name'].endswith('/github.com') and c.get('enabled')
        for c in check.get('defaultSupportedIdpConfigs', [])
    )
    print('VERIFIED enabled:', ok)


if __name__ == '__main__':
    main()

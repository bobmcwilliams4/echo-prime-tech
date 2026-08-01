'use client';

import { useState, useEffect } from 'react';

// "Install on phone" affordance: registers the vault service worker, captures
// Android's beforeinstallprompt for a one-tap install, and shows step-by-step
// Add-to-Home-Screen instructions on iOS Safari (which has no install API).
// Renders nothing once the app is already running standalone.

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isStandalone(): boolean {
  if (typeof window === 'undefined') return true;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (typeof window !== 'undefined' && window.localStorage.getItem('iv-install-dismissed')) {
      setDismissed(true);
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/immortality-vault/sw.js', { scope: '/immortality-vault/' })
        .catch(() => {});
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    if (isIOS()) setVisible(true);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  /* This banner is position:fixed at the bottom with nothing reserving space
     beneath it, so on a short viewport it sits on top of whatever the page ends
     with. On the biometric consent gate that is the consent checkbox and its
     submit button — measured covering both at a 577px-tall viewport, and consent
     is what unlocks Interview, Record Video and Voice Clone. The click lands on
     the banner and nothing happens, with no error; scrolling clears it, but a
     customer who clicks once and sees nothing may simply leave.
     Reserve the banner's height so page content can always scroll past it. */
  useEffect(() => {
    const showing = visible && !dismissed && !isStandalone();
    if (!showing || typeof document === 'undefined') return;
    const prev = document.body.style.paddingBottom;
    document.body.style.paddingBottom = '96px';
    return () => { document.body.style.paddingBottom = prev; };
  }, [visible, dismissed]);

  if (!visible || dismissed || isStandalone()) return null;

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === 'accepted') setVisible(false);
      setDeferred(null);
    } else {
      setShowIOSHelp(true);
    }
  };

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem('iv-install-dismissed', '1');
    } catch {}
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(10,14,23,0.95)',
          border: '1px solid rgba(212,175,55,0.45)',
          borderRadius: 999,
          padding: '10px 14px 10px 18px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
          maxWidth: 'calc(100vw - 24px)',
        }}
      >
        <span style={{ color: '#e8e8ee', fontSize: 14, whiteSpace: 'nowrap' }}>
          Get the Vault on your phone
        </span>
        <button
          onClick={install}
          style={{
            background: 'linear-gradient(135deg, #d4af37, #b8912a)',
            color: '#0a0a0f',
            fontWeight: 600,
            fontSize: 14,
            border: 'none',
            borderRadius: 999,
            padding: '8px 16px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Install app
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          style={{
            background: 'transparent',
            color: '#8a8a95',
            border: 'none',
            fontSize: 16,
            cursor: 'pointer',
            padding: '4px 6px',
          }}
        >
          &#10005;
        </button>
      </div>

      {showIOSHelp && (
        <div
          onClick={() => setShowIOSHelp(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#12121a',
              border: '1px solid rgba(212,175,55,0.35)',
              borderRadius: '16px 16px 0 0',
              padding: '24px 20px 32px',
              maxWidth: 480,
              width: '100%',
              color: '#e8e8ee',
            }}
          >
            <h3 style={{ margin: '0 0 14px', fontSize: 17, color: '#d4af37' }}>
              Add the Vault to your Home Screen
            </h3>
            <ol style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.9 }}>
              <li>
                Tap the <strong>Share</strong> button
                <span style={{ opacity: 0.7 }}> (square with an up arrow, in the Safari toolbar)</span>
              </li>
              <li>
                Scroll and tap <strong>Add to Home Screen</strong>
              </li>
              <li>
                Tap <strong>Add</strong> — the Vault appears like a regular app
              </li>
            </ol>
            <button
              onClick={() => setShowIOSHelp(false)}
              style={{
                marginTop: 18,
                width: '100%',
                background: 'linear-gradient(135deg, #d4af37, #b8912a)',
                color: '#0a0a0f',
                fontWeight: 600,
                fontSize: 15,
                border: 'none',
                borderRadius: 10,
                padding: '12px',
                cursor: 'pointer',
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

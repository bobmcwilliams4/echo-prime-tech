/* Immortality Vault — Capacitor native bridge (camera, mic, push, Apple Sign-In) */

import { API } from './constants';

export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.();
}

export async function initNativeShell(userId?: string): Promise<void> {
  if (!isNativeApp()) return;

  const { Capacitor } = await import('@capacitor/core');
  if (!Capacitor.isNativePlatform()) return;

  const { StatusBar, Style } = await import('@capacitor/status-bar');
  await StatusBar.setStyle({ style: Style.Dark });
  await StatusBar.setBackgroundColor({ color: '#0a0a0f' });

  const { SplashScreen } = await import('@capacitor/splash-screen');
  await SplashScreen.hide();

  if (userId) {
    await registerPushNotifications(userId);
  }
}

export async function registerPushNotifications(userId: string): Promise<void> {
  if (!isNativeApp()) return;

  const { PushNotifications } = await import('@capacitor/push-notifications');

  const perm = await PushNotifications.checkPermissions();
  if (perm.receive !== 'granted') {
    const req = await PushNotifications.requestPermissions();
    if (req.receive !== 'granted') return;
  }

  await PushNotifications.register();

  PushNotifications.addListener('registration', async (token) => {
    try {
      await fetch(`${API}/nudges/register-device`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          device_token: token.value,
          platform: 'ios',
          channel: 'push',
        }),
      });
    } catch { /* non-fatal — in-app nudges still work */ }
  });

  PushNotifications.addListener('pushNotificationReceived', () => {
    // Foreground delivery — BriefingPanel picks up pending nudges on next visit
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    const data = action.notification.data as { panel?: string } | undefined;
    if (data?.panel && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vault-navigate', { detail: data.panel }));
    }
  });
}

export async function signInWithAppleNative(): Promise<{ idToken: string; email?: string } | null> {
  if (!isNativeApp()) return null;

  try {
    const { SignInWithApple } = await import('@capacitor-community/apple-sign-in');
    const result = await SignInWithApple.authorize({
      clientId: 'com.echoomegaprime.immortalityvault',
      redirectURI: 'https://echo-prime-ai.firebaseapp.com/__/auth/handler',
      scopes: 'email name',
    });
    const idToken = result.response?.identityToken;
    if (!idToken) return null;
    return {
      idToken,
      email: result.response?.email ?? undefined,
    };
  } catch {
    return null;
  }
}

export async function capturePhotoNative(): Promise<Blob | null> {
  if (!isNativeApp()) return null;

  try {
    const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      saveToGallery: false,
    });
    if (!photo.webPath) return null;
    const resp = await fetch(photo.webPath);
    return resp.blob();
  } catch {
    return null;
  }
}
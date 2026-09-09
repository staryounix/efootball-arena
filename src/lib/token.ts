// src/lib/token.ts

/**
 * Token utilities using the Web Crypto API (compatible with Edge Runtime).
 * The secret is taken from the AUTH_SECRET environment variable.
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const SECRET = process.env.AUTH_SECRET || 'default-secret';

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(str: string): Uint8Array {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Sign a payload (object) and return a JWT‑like token. */
export async function signToken(payload: Record<string, unknown>): Promise<string> {
  const json = JSON.stringify(payload);
  const data = encoder.encode(json);
  const base64Data = toBase64Url(data);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(base64Data));
  const base64Sig = toBase64Url(new Uint8Array(sig));
  return `${base64Data}.${base64Sig}`;
}

/** Verify a token created by signToken. Returns the parsed payload or null. */
export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
  const [b64Data, b64Sig] = token.split('.');
  if (!b64Data || !b64Sig) return null;
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const sigBytes = fromBase64Url(b64Sig);
  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(b64Data));
  if (!valid) return null;
  const payloadJson = decoder.decode(fromBase64Url(b64Data));
  return JSON.parse(payloadJson);
}

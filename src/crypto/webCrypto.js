/**
 * webCrypto.js
 * ---------------------------------------------------------------------------
 * Implements the "Edge-Computed Cryptographic Authentication Pipeline"
 * described in Chapter 5, section 5.7.1 of the LisheSafi / Lishe Bora
 * system design, using the browser's native Web Crypto API (SubtleCrypto).
 *
 * Pipeline (per 5.7.1):
 *   1. Local Key Derivation — the plaintext password never leaves the
 *      browser. It is fed directly into crypto.subtle via PBKDF2.
 *   2. PBKDF2 Execution — 600,000 iterations over SHA-256, salted with the
 *      user's unique client_auth_verification_salt.
 *   3. Key Splitting — the 512-bit PBKDF2 output is split into two halves:
 *        Key A (Remote Auth Hash)   -> SHA-256(halfA) -> user_crypt_hash
 *        Key B (Local Decryption)   -> imported as a non-extractable
 *                                      AES-256-GCM CryptoKey
 *
 * Nothing here ever transmits or persists the raw password or the raw
 * Key B material. Key B is imported with extractable:false, satisfying the
 * "High-Assurance Cryptographic Integrity" non-functional requirement in
 * section 5.5: the key can be *used* for encrypt/decrypt operations but can
 * never be read back out or exported by JavaScript, even by this app.
 * ---------------------------------------------------------------------------
 */

const PBKDF2_ITERATIONS = 600_000;
const AES_KEY_LENGTH_BITS = 256;
const IV_LENGTH_BYTES = 12; // 96-bit IV, recommended size for AES-GCM

/** Cryptographically secure random bytes. */
export function randomBytes(length) {
  return crypto.getRandomValues(new Uint8Array(length));
}

export function toBase64(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function fromBase64(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Import the raw UTF-8 password bytes as PBKDF2 key material. Never stored. */
async function importPasswordKeyMaterial(password) {
  const encoded = new TextEncoder().encode(password);
  return crypto.subtle.importKey('raw', encoded, 'PBKDF2', false, ['deriveBits']);
}

/**
 * Step 1 & 2 — Local Key Derivation + PBKDF2 Execution.
 * Runs 600,000 rounds of PBKDF2/SHA-256 against the password and the
 * account's client_auth_verification_salt, entirely inside the browser.
 * Returns 64 bytes (512 bits) of master key material to be split.
 */
export async function deriveMasterBits(password, saltBytes) {
  const keyMaterial = await importPasswordKeyMaterial(password);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    512
  );
  return new Uint8Array(bits);
}

/**
 * Step 3, Key A — Remote Auth Hash.
 * SHA-256 of the first 32 bytes of master key material. This produces the
 * non-invertible `user_crypt_hash` used strictly to register/locate the
 * cloud storage record. The server (or, here, the local blind ledger stub)
 * only ever sees this hash — never the password, never Key B.
 */
export async function deriveAuthHash(masterBits) {
  const halfA = masterBits.slice(0, 32);
  const digest = await crypto.subtle.digest('SHA-256', halfA);
  return toBase64(digest);
}

/**
 * Step 3, Key B — Local Decryption Key.
 * The second 32 bytes of master key material are imported as a
 * non-extractable AES-256-GCM CryptoKey. Per 5.7.2, extractable:false means
 * the browser engine permits this key to be *used* for encrypt/decrypt but
 * blocks any JavaScript call (including ours) from reading the raw bytes
 * back out — the key never leaves the SubtleCrypto boundary.
 */
export async function deriveLocalDecryptionKey(masterBits) {
  const halfB = masterBits.slice(32, 64);
  return crypto.subtle.importKey(
    'raw',
    halfB,
    { name: 'AES-GCM', length: AES_KEY_LENGTH_BITS },
    false, // extractable: false — see 5.7.2
    ['encrypt', 'decrypt']
  );
}

/**
 * Edge Authenticated Encryption Execution (5.4) — encrypts a JS value with
 * AES-256-GCM entirely on-device, producing base64 ciphertext + IV suitable
 * for the "Zero-Knowledge Synchronization Pipeline" (opaque blobs only).
 */
export async function encryptJSON(cryptoKey, value) {
  const iv = randomBytes(IV_LENGTH_BYTES);
  const plaintext = new TextEncoder().encode(JSON.stringify(value));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, plaintext);
  return { ciphertext: toBase64(ciphertext), iv: toBase64(iv) };
}

export async function decryptJSON(cryptoKey, { ciphertext, iv }) {
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(iv) },
    cryptoKey,
    fromBase64(ciphertext)
  );
  return JSON.parse(new TextDecoder().decode(plaintext));
}

/** Same as above but for a raw string — used by the Vault demo encrypt box. */
export async function encryptText(cryptoKey, text) {
  const iv = randomBytes(IV_LENGTH_BYTES);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    new TextEncoder().encode(text)
  );
  return { ciphertext: toBase64(ciphertext), iv: toBase64(iv) };
}

export async function decryptText(cryptoKey, { ciphertext, iv }) {
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(iv) },
    cryptoKey,
    fromBase64(ciphertext)
  );
  return new TextDecoder().decode(plaintext);
}

export const CRYPTO_PARAMS = {
  pbkdf2Iterations: PBKDF2_ITERATIONS,
  cipher: 'AES-256-GCM',
  keyDerivation: 'PBKDF2-SHA256',
  ivLengthBytes: IV_LENGTH_BYTES,
};

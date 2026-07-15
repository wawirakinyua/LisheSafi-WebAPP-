/**
 * healthDataService.js
 * ---------------------------------------------------------------------------
 * "Zero-Knowledge Synchronization Pipeline" (5.4) — the remote replication
 * channel accepts data exclusively as base64-encoded AES-256-GCM ciphertext.
 * These two functions are the only bridge between the in-memory React app
 * state (plaintext, lives only on-device) and the blind cloud ledger
 * (ciphertext only). Every write here goes through crypto/webCrypto.js;
 * nothing plaintext is ever handed to services/cloudLedger.js.
 * ---------------------------------------------------------------------------
 */

import { encryptJSON, decryptJSON } from '../crypto/webCrypto';
import * as cloud from './cloudLedger';

export async function loadEncryptedState(userRef, localKey, fallbackState) {
  const record = await cloud.fetchLatestEncryptedHealthRecord(userRef);
  if (!record) return structuredClone(fallbackState);

  try {
    return await decryptJSON(localKey, {
      ciphertext: record.encrypted_ciphertext_blob,
      iv: record.crypto_initialization_vector,
    });
  } catch (err) {
    // A failed decrypt here means the wrong Key B was used — never fall back
    // to guessing; surface the fallback shape so the UI stays usable.
    console.warn('Decryption of remote health record failed; using defaults.', err);
    return structuredClone(fallbackState);
  }
}

export async function saveEncryptedState(userRef, localKey, state) {
  const payload = await encryptJSON(localKey, state);
  return cloud.pushEncryptedHealthRecord(userRef, payload);
}

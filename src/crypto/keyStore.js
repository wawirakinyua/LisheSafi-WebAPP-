/**
 * keyStore.js
 * ---------------------------------------------------------------------------
 * "Secure Client-Side Storage Enclave (IndexedDB)" — Chapter 5, section 5.3.
 *
 * Persists the locally-derived, non-extractable Key B (AES-256-GCM
 * CryptoKey) inside the browser's IndexedDB. Because the key object was
 * imported with extractable:false (see crypto/webCrypto.js), IndexedDB
 * stores an opaque handle to the key material, not the bytes themselves —
 * a malicious script (e.g. via XSS) that reads this object store still
 * cannot export the raw key, only invoke it for encrypt/decrypt.
 *
 * This is what lets a returning user "unlock" their vault without
 * re-deriving Key B from their password every time: the key simply stays
 * resident, keyed by their user_ref, in this device-local enclave.
 * ---------------------------------------------------------------------------
 */

const DB_NAME = 'lishe_bora_secure_enclave';
const DB_VERSION = 1;
const STORE_NAME = 'local_decryption_keys';

function openEnclave() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Store the non-extractable CryptoKey object, keyed by user_ref. */
export async function saveLocalDecryptionKey(userRef, cryptoKey) {
  const db = await openEnclave();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(cryptoKey, userRef);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Retrieve the CryptoKey object for this device, or null if never stored here. */
export async function loadLocalDecryptionKey(userRef) {
  const db = await openEnclave();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(userRef);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

/** Used by the "Shred my data" flow — permanently destroys the local key. */
export async function deleteLocalDecryptionKey(userRef) {
  const db = await openEnclave();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(userRef);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

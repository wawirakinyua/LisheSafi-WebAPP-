/**
 * cloudLedgerLocal.js
 * ---------------------------------------------------------------------------
 * "Blind Remote Persistence Ledger" / "Opaque Central Storage Ledger"
 * — Chapter 5, sections 5.2, 5.3 and 5.6.
 *
 * This module is the ONLY place that stands in for a real network call to
 * a cloud database (MongoDB Atlas / Firebase, per section 5.10's cost
 * breakdown). Since this project ships as a static, front-end reference
 * implementation, it persists the two opaque collections described in the
 * chapter — `vault_users` and `encrypted_health_data` — to the browser's
 * localStorage instead of a live server.
 *
 * The important architectural guarantee holds either way: every record
 * written here is either a non-invertible hash/salt (vault_users) or
 * base64 AES-256-GCM ciphertext (encrypted_health_data). Nothing in this
 * file ever sees a plaintext health value or a raw password.
 *
 * Swapping this stub for a real backend later means replacing the bodies
 * of these functions with `fetch()` calls to your API — every other layer
 * (crypto/, services/authService.js, services/healthDataService.js, and
 * all React components) is written against this same function contract
 * and does not need to change.
 * ---------------------------------------------------------------------------
 */

const VAULT_USERS_KEY = 'lishebora_cloud__vault_users';
const ENCRYPTED_HEALTH_DATA_KEY = 'lishebora_cloud__encrypted_health_data';

function readCollection(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCollection(storageKey, records) {
  localStorage.setItem(storageKey, JSON.stringify(records));
}

function makeId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/* ---------------------------- vault_users -------------------------------- */
/* Schema (5.6, image: vault_users):
     _id
     user_crypt_hash                    (non-invertible, SHA-256 of Key A)
     client_auth_verification_salt      (base64 PBKDF2 salt — public, not secret)
     tracking_index_created_epoch
*/

export async function createUser({ user_crypt_hash, client_auth_verification_salt }) {
  const users = readCollection(VAULT_USERS_KEY);
  const record = {
    _id: makeId(),
    user_crypt_hash,
    client_auth_verification_salt,
    tracking_index_created_epoch: Math.floor(Date.now() / 1000),
  };
  users.push(record);
  writeCollection(VAULT_USERS_KEY, users);
  return record;
}

export async function findUserById(userRef) {
  return readCollection(VAULT_USERS_KEY).find((u) => u._id === userRef) ?? null;
}

export async function findUserByAuthHash(user_crypt_hash) {
  return readCollection(VAULT_USERS_KEY).find((u) => u.user_crypt_hash === user_crypt_hash) ?? null;
}

export async function updateUserCredentials(userRef, { user_crypt_hash, client_auth_verification_salt }) {
  const users = readCollection(VAULT_USERS_KEY);
  const idx = users.findIndex((u) => u._id === userRef);
  if (idx === -1) throw new Error('User not found');
  users[idx] = { ...users[idx], user_crypt_hash, client_auth_verification_salt };
  writeCollection(VAULT_USERS_KEY, users);
  return users[idx];
}

/* ------------------------ encrypted_health_data -------------------------- */
/* Schema (5.6, image: encrypted_health_data):
     _id
     user_crypt_hash (user_ref)
     encrypted_ciphertext_blob   (base64 AES-256-GCM ciphertext)
     crypto_initialization_vector (base64 IV)
     last_sync_timestamp
*/

export async function pushEncryptedHealthRecord(userRef, { ciphertext, iv }) {
  const records = readCollection(ENCRYPTED_HEALTH_DATA_KEY);
  const record = {
    _id: makeId(),
    user_ref: userRef,
    encrypted_ciphertext_blob: ciphertext,
    crypto_initialization_vector: iv,
    last_sync_timestamp: new Date().toISOString(),
  };
  records.push(record);
  writeCollection(ENCRYPTED_HEALTH_DATA_KEY, records);
  return record;
}

export async function fetchLatestEncryptedHealthRecord(userRef) {
  const records = readCollection(ENCRYPTED_HEALTH_DATA_KEY).filter((r) => r.user_ref === userRef);
  if (!records.length) return null;
  return records.reduce((latest, r) => (r.last_sync_timestamp > latest.last_sync_timestamp ? r : latest));
}

export async function fetchAllEncryptedHealthRecords(userRef) {
  return readCollection(ENCRYPTED_HEALTH_DATA_KEY).filter((r) => r.user_ref === userRef);
}

/* ------------------------------- shredding -------------------------------- */

export async function deleteUserAndRecords(userRef) {
  writeCollection(VAULT_USERS_KEY, readCollection(VAULT_USERS_KEY).filter((u) => u._id !== userRef));
  writeCollection(
    ENCRYPTED_HEALTH_DATA_KEY,
    readCollection(ENCRYPTED_HEALTH_DATA_KEY).filter((r) => r.user_ref !== userRef)
  );
}

/**
 * cloudLedgerApi.js
 * ---------------------------------------------------------------------------
 * Real backend version of the "Blind Remote Persistence Ledger" (5.3, 5.6).
 * Same four-function contract as cloudLedgerLocal.js, but talks over HTTPS
 * to a real server that owns the MongoDB connection — the browser never
 * touches MongoDB directly (it can't: no driver access from a browser tab,
 * and Atlas's old browser-facing Data API was fully retired by MongoDB on
 * 30 Sept 2025).
 *
 * >>> FILL THIS IN with whatever your teammate's backend actually exposes.
 * The route paths, methods, and response shapes below are a reasonable
 * REST convention and a starting guess — edit them to match the real API
 * once you have it. Nothing outside this file needs to change: authService.js
 * and healthDataService.js only ever call the four exported functions.
 * ---------------------------------------------------------------------------
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${options.method || 'GET'} ${path} failed (${res.status}): ${body}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

/* ---------------------------- vault_users -------------------------------- */

export async function createUser({ user_crypt_hash, client_auth_verification_salt }) {
  return request('/api/vault-users', {
    method: 'POST',
    body: JSON.stringify({ user_crypt_hash, client_auth_verification_salt }),
  });
  // Expected response: { _id, user_crypt_hash, client_auth_verification_salt, tracking_index_created_epoch }
}

export async function findUserById(userRef) {
  try {
    return await request(`/api/vault-users/${encodeURIComponent(userRef)}`);
  } catch {
    return null;
  }
}

export async function findUserByAuthHash(user_crypt_hash) {
  try {
    return await request(`/api/vault-users/by-hash/${encodeURIComponent(user_crypt_hash)}`);
  } catch {
    return null;
  }
}

export async function updateUserCredentials(userRef, { user_crypt_hash, client_auth_verification_salt }) {
  return request(`/api/vault-users/${encodeURIComponent(userRef)}`, {
    method: 'PATCH',
    body: JSON.stringify({ user_crypt_hash, client_auth_verification_salt }),
  });
}

/* ------------------------ encrypted_health_data -------------------------- */

export async function pushEncryptedHealthRecord(userRef, { ciphertext, iv }) {
  return request('/api/encrypted-health-data', {
    method: 'POST',
    body: JSON.stringify({
      user_ref: userRef,
      encrypted_ciphertext_blob: ciphertext,
      crypto_initialization_vector: iv,
    }),
  });
}

export async function fetchLatestEncryptedHealthRecord(userRef) {
  try {
    return await request(`/api/encrypted-health-data/${encodeURIComponent(userRef)}/latest`);
  } catch {
    return null;
  }
}

export async function fetchAllEncryptedHealthRecords(userRef) {
  try {
    return await request(`/api/encrypted-health-data/${encodeURIComponent(userRef)}`);
  } catch {
    return [];
  }
}

/* ------------------------------- shredding -------------------------------- */

export async function deleteUserAndRecords(userRef) {
  await request(`/api/vault-users/${encodeURIComponent(userRef)}`, { method: 'DELETE' });
}

/**
 * authService.js
 * ---------------------------------------------------------------------------
 * Orchestrates the "Edge-Computed Cryptographic Authentication Pipeline"
 * (5.7.1) end-to-end: password in, non-extractable local decryption key
 * and a cloud-side auth hash out. No plaintext credential or key material
 * ever crosses into cloudLedger.js.
 * ---------------------------------------------------------------------------
 */

import {
  randomBytes,
  toBase64,
  fromBase64,
  deriveMasterBits,
  deriveAuthHash,
  deriveLocalDecryptionKey,
} from '../crypto/webCrypto';
import { saveLocalDecryptionKey, loadLocalDecryptionKey, deleteLocalDecryptionKey } from '../crypto/keyStore';
import * as cloud from './cloudLedger';

const DEVICE_USER_REF_KEY = 'lishebora_device_user_ref';

export class WrongPasswordError extends Error {}
export class NoVaultOnDeviceError extends Error {}

/** Is there a vault already registered on this browser/device? */
export function getDeviceVaultStatus() {
  return { hasVaultOnDevice: !!localStorage.getItem(DEVICE_USER_REF_KEY) };
}

/**
 * Registration — first-time vault creation.
 * Derives Key A + Key B from the chosen password, registers the
 * non-invertible hash + salt in the (mock) cloud ledger, and stores the
 * non-extractable Key B in this device's IndexedDB enclave.
 */
export async function registerVault(password) {
  const salt = randomBytes(16);
  const masterBits = await deriveMasterBits(password, salt);
  const user_crypt_hash = await deriveAuthHash(masterBits);
  const localKey = await deriveLocalDecryptionKey(masterBits);

  const userRecord = await cloud.createUser({
    user_crypt_hash,
    client_auth_verification_salt: toBase64(salt),
  });

  await saveLocalDecryptionKey(userRecord._id, localKey);
  localStorage.setItem(DEVICE_USER_REF_KEY, userRecord._id);

  return { userRef: userRecord._id, localKey, userRecord };
}

/**
 * Unlock — re-authenticates an existing vault on this device.
 * Re-derives Key A to verify the password against the stored hash, then
 * prefers the CryptoKey already resident in IndexedDB for Key B (per
 * 5.3's "Secure Client-Side Storage Enclave"). If this is a fresh device
 * enclave (e.g. the app storage was cleared) it re-derives and re-persists
 * Key B, which is safe since it is deterministic from password + salt.
 */
export async function unlockVault(password) {
  const userRef = localStorage.getItem(DEVICE_USER_REF_KEY);
  if (!userRef) throw new NoVaultOnDeviceError('No vault registered on this device.');

  const userRecord = await cloud.findUserById(userRef);
  if (!userRecord) throw new NoVaultOnDeviceError('Vault record missing from the cloud ledger.');

  const salt = fromBase64(userRecord.client_auth_verification_salt);
  const masterBits = await deriveMasterBits(password, salt);
  const attemptHash = await deriveAuthHash(masterBits);

  if (attemptHash !== userRecord.user_crypt_hash) {
    throw new WrongPasswordError('Password does not match this vault.');
  }

  let localKey = await loadLocalDecryptionKey(userRef);
  if (!localKey) {
    localKey = await deriveLocalDecryptionKey(masterBits);
    await saveLocalDecryptionKey(userRef, localKey);
  }

  return { userRef, localKey, userRecord };
}

/** Checks a password against the stored hash without touching the local key. Used before sensitive actions (changing password, deleting the account). */
export async function verifyPassword(userRef, password) {
  const userRecord = await cloud.findUserById(userRef);
  if (!userRecord) throw new NoVaultOnDeviceError('Vault record missing from the cloud ledger.');
  const salt = fromBase64(userRecord.client_auth_verification_salt);
  const masterBits = await deriveMasterBits(password, salt);
  const attemptHash = await deriveAuthHash(masterBits);
  return attemptHash === userRecord.user_crypt_hash;
}

/**
 * Changing a password means deriving an entirely new Key A / Key B pair
 * (new salt, new hash, new local decryption key) — there's no way to keep
 * the old encryption key and just swap the password, since the key IS a
 * function of the password. Callers are responsible for re-encrypting and
 * re-saving the user's data with the returned key right after this runs.
 */
export async function changePassword(userRef, oldPassword, newPassword) {
  const ok = await verifyPassword(userRef, oldPassword);
  if (!ok) throw new WrongPasswordError('Current password is incorrect.');

  const newSalt = randomBytes(16);
  const newMasterBits = await deriveMasterBits(newPassword, newSalt);
  const newHash = await deriveAuthHash(newMasterBits);
  const newLocalKey = await deriveLocalDecryptionKey(newMasterBits);

  const updatedRecord = await cloud.updateUserCredentials(userRef, {
    user_crypt_hash: newHash,
    client_auth_verification_salt: toBase64(newSalt),
  });
  await saveLocalDecryptionKey(userRef, newLocalKey);

  return { newLocalKey, userRecord: updatedRecord };
}

/** Permanently destroys the local key and the (mock) cloud-side records. */
export async function shredVault(userRef) {
  await deleteLocalDecryptionKey(userRef);
  await cloud.deleteUserAndRecords(userRef);
  localStorage.removeItem(DEVICE_USER_REF_KEY);
}

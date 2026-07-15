import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as authService from '../services/authService';
import * as healthDataService from '../services/healthDataService';
import { encryptText, decryptText, CRYPTO_PARAMS } from '../crypto/webCrypto';
import { buildDefaultAppState } from '../data/defaultAppState';

const VaultContext = createContext(null);

/**
 * Vault lifecycle states:
 *   'checking'  — reading whether this device already has a vault
 *   'noVault'   — first run on this device: show "Create your vault"
 *   'locked'    — a vault exists on this device, but this session hasn't
 *                 supplied the password yet: show "Unlock your vault"
 *   'unlocked'  — Key B is live in memory (as a CryptoKey reference); the
 *                 dashboard can read/write appState
 */
export function VaultProvider({ children }) {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);
  const [userRef, setUserRef] = useState(null);
  const [userRecord, setUserRecord] = useState(null);
  const [appState, setAppState] = useState(null);
  const localKeyRef = useRef(null); // the non-extractable CryptoKey never goes into React state/render tree

  useEffect(() => {
    const { hasVaultOnDevice } = authService.getDeviceVaultStatus();
    setStatus(hasVaultOnDevice ? 'locked' : 'noVault');
  }, []);

  const register = useCallback(async (password, displayName) => {
    setError(null);
    const { userRef: newUserRef, localKey, userRecord: rec } = await authService.registerVault(password);
    localKeyRef.current = localKey;
    const initialState = buildDefaultAppState(displayName || 'there');
    await healthDataService.saveEncryptedState(newUserRef, localKey, initialState);
    setUserRef(newUserRef);
    setUserRecord(rec);
    setAppState(initialState);
    setStatus('unlocked');
  }, []);

  const unlock = useCallback(async (password) => {
    setError(null);
    try {
      const { userRef: existingUserRef, localKey, userRecord: rec } = await authService.unlockVault(password);
      localKeyRef.current = localKey;
      const loaded = await healthDataService.loadEncryptedState(
        existingUserRef,
        localKey,
        buildDefaultAppState(rec?.displayName)
      );
      setUserRef(existingUserRef);
      setUserRecord(rec);
      setAppState(loaded);
      setStatus('unlocked');
    } catch (err) {
      setError(err.message || 'Could not unlock vault.');
      throw err;
    }
  }, []);

  const lock = useCallback(() => {
    localKeyRef.current = null;
    setAppState(null);
    setUserRef(null);
    setStatus('locked');
  }, []);

  const shred = useCallback(
    async (password) => {
      if (!userRef) return;
      const ok = await authService.verifyPassword(userRef, password);
      if (!ok) throw new authService.WrongPasswordError('Incorrect password.');
      await authService.shredVault(userRef);
      localKeyRef.current = null;
      setAppState(null);
      setUserRef(null);
      setUserRecord(null);
      setStatus('noVault');
    },
    [userRef]
  );

  /** Update app state locally, then re-encrypt + push the whole snapshot. */
  const updateAndSync = useCallback(
    async (updater) => {
      if (!localKeyRef.current || !userRef) return;
      setAppState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        healthDataService.saveEncryptedState(userRef, localKeyRef.current, next).catch((err) => {
          console.error('Zero-knowledge sync failed:', err);
        });
        return next;
      });
    },
    [userRef]
  );

  const updateDisplayName = useCallback(
    (name) => {
      updateAndSync((prev) => ({ ...prev, profile: { ...prev.profile, displayName: name } }));
    },
    [updateAndSync]
  );

  /** Verifies the old password, derives a brand-new key pair, and re-encrypts the current state under the new key. */
  const changePassword = useCallback(
    async (oldPassword, newPassword) => {
      if (!userRef) throw new Error('Vault is locked.');
      const { newLocalKey, userRecord: updatedRecord } = await authService.changePassword(userRef, oldPassword, newPassword);
      if (appState) {
        await healthDataService.saveEncryptedState(userRef, newLocalKey, appState);
      }
      localKeyRef.current = newLocalKey;
      setUserRecord(updatedRecord);
    },
    [userRef, appState]
  );

  /** Manual "Add Meal / Sync" button — re-encrypts current state and re-pushes. */
  const forceSync = useCallback(async () => {
    if (!localKeyRef.current || !userRef || !appState) return;
    await healthDataService.saveEncryptedState(userRef, localKeyRef.current, appState);
  }, [userRef, appState]);

  /** Vault demo box — real AES-256-GCM round trip on arbitrary text. */
  const encryptDemo = useCallback(async (text) => {
    if (!localKeyRef.current) throw new Error('Vault is locked.');
    return encryptText(localKeyRef.current, text);
  }, []);
  const decryptDemo = useCallback(async (payload) => {
    if (!localKeyRef.current) throw new Error('Vault is locked.');
    return decryptText(localKeyRef.current, payload);
  }, []);

  const value = {
    status,
    error,
    userRef,
    userRecord,
    appState,
    cryptoParams: CRYPTO_PARAMS,
    register,
    unlock,
    lock,
    shred,
    updateAndSync,
    updateDisplayName,
    changePassword,
    forceSync,
    encryptDemo,
    decryptDemo,
  };

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error('useVault must be used within a VaultProvider');
  return ctx;
}

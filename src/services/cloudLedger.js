/**
 * cloudLedger.js
 * ---------------------------------------------------------------------------
 * Switchboard between the two ledger implementations:
 *   - cloudLedgerLocal.js  → localStorage stand-in, works with zero setup
 *   - cloudLedgerApi.js    → real HTTPS calls to your teammate's backend
 *
 * Controlled by VITE_BACKEND_MODE in your .env file ('local' or 'api').
 * Defaults to 'local' so the app keeps working out of the box even before
 * a backend URL exists. Every other file in the app imports from HERE, not
 * from cloudLedgerLocal.js/cloudLedgerApi.js directly — so flipping this
 * one switch is the entire migration.
 * ---------------------------------------------------------------------------
 */

import * as local from './cloudLedgerLocal.js';
import * as api from './cloudLedgerApi.js';

const mode = import.meta.env.VITE_BACKEND_MODE === 'api' ? api : local;

export const createUser = mode.createUser;
export const findUserById = mode.findUserById;
export const findUserByAuthHash = mode.findUserByAuthHash;
export const updateUserCredentials = mode.updateUserCredentials;
export const pushEncryptedHealthRecord = mode.pushEncryptedHealthRecord;
export const fetchLatestEncryptedHealthRecord = mode.fetchLatestEncryptedHealthRecord;
export const fetchAllEncryptedHealthRecords = mode.fetchAllEncryptedHealthRecords;
export const deleteUserAndRecords = mode.deleteUserAndRecords;

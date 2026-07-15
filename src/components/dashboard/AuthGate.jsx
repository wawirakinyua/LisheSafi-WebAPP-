import { useState } from 'react';
import { useVault } from '../../context/VaultContext.jsx';

export default function AuthGate() {
  const { status, error, register, unlock } = useVault();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState(null);

  const isRegister = status === 'noVault';

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    if (isRegister && password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Use at least 8 characters — this password derives your entire encryption key.');
      return;
    }
    setBusy(true);
    try {
      if (isRegister) {
        await register(password, displayName.trim() || 'there');
      } else {
        await unlock(password);
      }
    } catch (err) {
      setLocalError(err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="authgate">
      <div className="authgate-card">
        <div className="authgate-lock">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="10" rx="2" stroke="var(--forest-dark)" strokeWidth="1.7" /><path d="M8 10V7a4 4 0 018 0v3" stroke="var(--forest-dark)" strokeWidth="1.7" /></svg>
        </div>
        <h1>{isRegister ? 'Create your vault' : 'Unlock your vault'}</h1>
        <p>
          {isRegister
            ? 'Your password never leaves this browser.'
            : 'An account already exists on this device. Enter your password .'}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <label className="authgate-field">
               Name 
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Amanda"
                autoComplete="off"
              />
            </label>
          )}
          <label className="authgate-field">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
            />
          </label>
          {isRegister && (
            <label className="authgate-field">
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </label>
          )}

          {(localError || error) && <p className="authgate-error">{localError || error}</p>}

          <button className="btn-sync authgate-submit" type="submit" disabled={busy}>
            {busy ? 'Deriving keys…' : isRegister ? 'Create Vault' : 'Unlock Vault'}
          </button>
        </form>

        <p className="authgate-fineprint">
          {isRegister
            ? "There is no password reset. Losing this password means your data can not be recovered this is achieved by the security design, not even by us."
            : 'Wrong device? Your data is bound to this browser\'s local key store  sign in on the device where you created your vault.'}
        </p>
      </div>
    </div>
  );
}

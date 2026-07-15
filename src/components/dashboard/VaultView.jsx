import { useState } from 'react';
import { useVault } from '../../context/VaultContext.jsx';

export default function VaultView() {
  const {
    userRef,
    userRecord,
    appState,
    updateDisplayName,
    changePassword,
    shred,
  } = useVault();

  // --- name ---
  const [name, setName] = useState(appState?.profile?.displayName ?? '');
  const [nameSaved, setNameSaved] = useState(false);

  function handleSaveName(e) {
    e.preventDefault();
    updateDisplayName(name.trim() || 'there');
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 1800);
  }

  // --- password change ---
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMessage, setPwMessage] = useState(null);
  const [pwError, setPwError] = useState(null);

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwError(null);
    setPwMessage(null);
    if (newPw.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('New passwords do not match.');
      return;
    }
    setPwBusy(true);
    try {
      await changePassword(oldPw, newPw);
      setPwMessage('Password updated — your data has been re-encrypted with the new key.');
      setOldPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (err) {
      setPwError(err.message || 'Could not update password.');
    } finally {
      setPwBusy(false);
    }
  }

  // --- delete account ---
  const [deletePw, setDeletePw] = useState('');
  const [deleteError, setDeleteError] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function handleDelete() {
    setDeleteError(null);
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    setDeleteBusy(true);
    try {
      await shred(deletePw);
    } catch (err) {
      setDeleteError(err.message || 'Incorrect password.');
      setConfirmingDelete(false);
    } finally {
      setDeleteBusy(false);
    }
  }

  // --- download data ---
  function handleExport() {
    const backup = {
      exported_at: new Date().toISOString(),
      vault_users_record: userRecord,
      note: 'This backup is opaque ciphertext + non-secret metadata only. It cannot be decrypted without your password.',
      encrypted_health_data: JSON.parse(localStorage.getItem('lishebora_cloud__encrypted_health_data') || '[]').filter(
        (r) => r.user_ref === userRef
      ),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lishe-bora-my-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="view active" id="vault">
      <div className="view-head">
        <h2>Account &amp; privacy</h2>
        <p>Locked securely on your device.</p>
      </div>

      <div className="row-top">
        <div className="card">
          <h2 style={{ marginBottom: 16 }}>Your name</h2>
          <form onSubmit={handleSaveName} className="inline-form">
            <input
              className="vault-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name"
            />
            <button className="btn-sm primary" type="submit">Save name</button>
          </form>
          {nameSaved && <p className="vault-success">Saved.</p>}
        </div>

        <div className="card">
          <h2 style={{ marginBottom: 16 }}>Change password</h2>
          <form onSubmit={handleChangePassword} className="stacked-form">
            <input
              type="password"
              className="vault-input"
              placeholder="Current password"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              autoComplete="current-password"
            />
            <input
              type="password"
              className="vault-input"
              placeholder="New password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              autoComplete="new-password"
            />
            <input
              type="password"
              className="vault-input"
              placeholder="Confirm new password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              autoComplete="new-password"
            />
            {pwError && <p className="authgate-error">{pwError}</p>}
            {pwMessage && <p className="vault-success">{pwMessage}</p>}
            <button className="btn-sm primary" type="submit" disabled={pwBusy}>
              {pwBusy ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>

      <div className="row-top" style={{ marginTop: 24 }}>
        <div className="card" style={{ flex: 1 }}>
          <h2 style={{ marginBottom: 16 }}>Your data</h2>
          <p className="card-sub">Download everything, or permanently delete your account.</p>

          <div className="vault-actions" style={{ marginTop: 16 }}>
            <button className="btn-sm" onClick={handleExport}>Download my data</button>
          </div>

          <div style={{ marginTop: 28, paddingTop: 22, borderTop: '1px dashed var(--line)' }}>
            <p className="card-sub" style={{ marginBottom: 12 }}>
              This will permanently delete your account and all encrypted data. This cannot be undone.
            </p>
            <input
              type="password"
              className="vault-input"
              placeholder="Enter your password to confirm deletion"
              value={deletePw}
              onChange={(e) => setDeletePw(e.target.value)}
            />
            <button
              className="btn-sm danger"
              style={{ marginTop: 12 }}
              onClick={handleDelete}
              disabled={deleteBusy || !deletePw}
            >
              {confirmingDelete ? 'Click again to permanently delete' : 'Delete my account'}
            </button>
            {deleteError && <p className="authgate-error">{deleteError}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

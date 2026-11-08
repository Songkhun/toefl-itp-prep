import { useEffect, useState } from 'react';
import { download, useEnv } from '../context';
import { ImportError, validateBackup, type Settings as S } from '../../storage/store';
import { buildReminderIcs } from '../../settings/ics';
import { localDate } from '../../plan/plan';

export function Settings() {
  const { store, clock } = useEnv();
  const [settings, setSettings] = useState<S | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => { void store.getSettings().then(setSettings); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!settings) return <p className="muted">Loading…</p>;

  const save = async (next: S) => { setSettings(next); await store.saveSettings(next); };

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const text = await file.text();
      let data: unknown;
      try { data = JSON.parse(text); } catch { throw new ImportError('This file is not valid JSON.'); }
      validateBackup(data);
      if (window.confirm('Replace all progress on this device with this backup?')) {
        await store.importAll(data);
        setSettings(await store.getSettings());
        setMessage({ ok: true, text: 'Backup restored.' });
      }
    } catch (e) {
      setMessage({ ok: false, text: e instanceof ImportError ? e.message : 'Could not read this file.' });
    }
  };

  return (
    <div>
      <h1>⚙️ Settings</h1>
      <div className="card">
        <label htmlFor="nw">New words per day</label>
        <input id="nw" type="number" min={5} max={40} value={settings.newWordsPerDay}
          onChange={(e) => void save({ ...settings, newWordsPerDay: Math.min(40, Math.max(5, Number(e.target.value) || 15)) })} />
        <label htmlFor="td">Test date (optional)</label>
        <div className="row">
          <input id="td" type="date" value={settings.testDate ?? ''} min={localDate(clock())}
            onChange={(e) => void save({ ...settings, testDate: e.target.value || null })} />
          {settings.testDate && <button onClick={() => void save({ ...settings, testDate: null })}>Clear</button>}
        </div>
      </div>
      <div className="card">
        <strong>Reminders</strong>
        <p className="muted">Adds two daily events (07:00 and 16:30) to your phone's calendar.</p>
        <button onClick={() => download('toefl-reminders.ics', buildReminderIcs(clock()), 'text/calendar')}>Add reminders to calendar</button>
      </div>
      <div className="card">
        <strong>Backup</strong>
        <p className="muted">Your progress is stored only on this device. Export a backup now and then.</p>
        <button onClick={() => void (async () => {
          const b = await store.exportAll();
          download(`itp-prep-backup-${localDate(clock())}.json`, JSON.stringify(b), 'application/json');
          await save({ ...settings, lastExportAt: clock().getTime() });
        })()}>Export backup</button>
        {settings.lastExportAt && <p className="muted">Last backup: {new Date(settings.lastExportAt).toLocaleDateString('en-GB')}</p>}
        <label htmlFor="imp">Import backup</label>
        <input id="imp" type="file" accept="application/json,.json" onChange={(e) => void onImport(e.target.files?.[0])} />
        {message && <p className={message.ok ? 'card ok' : 'card bad'} role="status">{message.text}</p>}
      </div>
    </div>
  );
}

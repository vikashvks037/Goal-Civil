'use client';
import { ENDPOINTS } from '@/constants';
import { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';

const EMPTY = {
  siteName: 'Goal Civil', email: '', phone: '', address: '',
  facebook: '', twitter: '', youtube: '', instagram: '', bannerText: '',
};

const Field = ({ label, value, onChange, placeholder = '' }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
    <input
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
      <p className="text-sm font-bold text-gray-700">{title}</p>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </div>
);

export function SettingsManager() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(ENDPOINTS.ADMIN.SETTINGS)
      .then(r => r.json())
      .then(d => { if (d.settings) setForm({ ...EMPTY, ...d.settings }); })
      .finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const save = async () => {
    setSaving(true);
    await fetch(ENDPOINTS.ADMIN.SETTINGS, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return (
    <div className="space-y-4 max-w-2xl">
      {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse"/>)}
    </div>
  );

  return (
    <div className="space-y-5 max-w-2xl">

      {/* General */}
      <SectionCard title="General">
        <Field label="Site Name" value={form.siteName} onChange={v => set('siteName', v)} placeholder="Goal Civil" />
        <Field label="Banner Text (shown at top of site)" value={form.bannerText} onChange={v => set('bannerText', v)} placeholder="New batch starting soon!" />
      </SectionCard>

      {/* Footer Contact Info */}
      <SectionCard title="Footer — Contact Info">
        <p className="text-xs text-gray-400 -mt-1">Yeh data website ke footer mein dikhega.</p>
        <Field label="Address" value={form.address} onChange={v => set('address', v)} placeholder="Harrakh Kothi Road, Begusarai, Bihar 851218" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone" value={form.phone} onChange={v => set('phone', v)} placeholder="+91 98765 43210" />
          <Field label="Email" value={form.email} onChange={v => set('email', v)} placeholder="info@goalcivil.com" />
        </div>
      </SectionCard>

      {/* Save */}
      <button
        onClick={save}
        disabled={saving}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
      >
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Settings'}
      </button>
    </div>
  );
}

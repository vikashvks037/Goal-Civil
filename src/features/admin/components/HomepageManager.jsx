'use client';
import { ENDPOINTS } from '@/constants';
import { useEffect, useState } from 'react';
import {
  Save, Plus, Trash2, ChevronDown, ChevronUp, Loader2,
  Layout, Star, Info, Users, Phone,
} from 'lucide-react';

/* ─── helpers ────────────────────────────────────────────── */
const Section = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 font-bold text-gray-800">
          {Icon && <Icon size={18} className="text-blue-600" />}
          {title}
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">{children}</div>}
    </div>
  );
};

const Field = ({ label, value, onChange, multiline = false, placeholder = '' }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">{label}</label>
    {multiline
      ? <textarea rows={3} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
      : <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    }
  </div>
);

/* ─── main component ─────────────────────────────────────── */
export function HomepageManager() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(ENDPOINTS.ADMIN.HOMEPAGE)
      .then(r => r.json())
      .then(d => setData(d.content || {}))
      .finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }));

  const save = async () => {
    setSaving(true);
    await fetch(ENDPOINTS.ADMIN.HOMEPAGE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  /* ── list helpers ── */
  const addItem = (key, template) => set(key, [...(data[key] || []), template]);
  const removeItem = (key, i) => set(key, (data[key] || []).filter((_, idx) => idx !== i));
  const updateItem = (key, i, field, val) =>
    set(key, (data[key] || []).map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  if (loading) return (
    <div className="flex items-center gap-3 text-gray-500 py-10">
      <Loader2 size={20} className="animate-spin" /> Loading homepage content…
    </div>
  );

  return (
    <div className="space-y-4 max-w-3xl">

      {/* ── HERO ── */}
      <Section title="Hero Section" icon={Layout} defaultOpen>
        <Field label="Badge Text" value={data.heroBadgeText} onChange={v => set('heroBadgeText', v)} placeholder="New Batch Starting Soon" />
        <Field label="Main Heading" value={data.heroTitle} onChange={v => set('heroTitle', v)} multiline placeholder="BPSC with Bihar's Best Online Coaching" />
        <Field label="Subtitle / Description" value={data.heroSubtitle} onChange={v => set('heroSubtitle', v)} multiline />
        <Field label="CTA Button Label" value={data.heroCtaLabel} onChange={v => set('heroCtaLabel', v)} placeholder="Register Now" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Trust Badge 1" value={data.heroBadge1} onChange={v => set('heroBadge1', v)} placeholder="Free Trial Available" />
          <Field label="Trust Badge 2" value={data.heroBadge2} onChange={v => set('heroBadge2', v)} placeholder="Cancel Anytime" />
        </div>
      </Section>

      {/* ── FEATURES ── */}
      <Section title="Features / Course Advantages" icon={Star}>
        <Field label="Section Heading" value={data.featuresTitle} onChange={v => set('featuresTitle', v)} />
        {(data.features || []).map((f, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-4 space-y-2 relative">
            <button onClick={() => removeItem('features', i)}
              className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors">
              <Trash2 size={14} />
            </button>
            <Field label={`Feature ${i + 1} Title`} value={f.title} onChange={v => updateItem('features', i, 'title', v)} placeholder="Feature title" />
            <Field label="Description" value={f.desc} onChange={v => updateItem('features', i, 'desc', v)} multiline placeholder="Feature description" />
          </div>
        ))}
        <button onClick={() => addItem('features', { title: '', desc: '' })}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors">
          <Plus size={15} /> Add Feature
        </button>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section title="Testimonials" icon={Users}>
        <Field label="Section Heading" value={data.testimonialsTitle} onChange={v => set('testimonialsTitle', v)} />
        {(data.testimonials || []).map((t, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-4 space-y-2 relative">
            <button onClick={() => removeItem('testimonials', i)}
              className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors">
              <Trash2 size={14} />
            </button>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Student Name" value={t.name} onChange={v => updateItem('testimonials', i, 'name', v)} />
              <Field label="City" value={t.city} onChange={v => updateItem('testimonials', i, 'city', v)} />
            </div>
            <Field label="Rank / Achievement" value={t.rank} onChange={v => updateItem('testimonials', i, 'rank', v)} placeholder="BPSC 69th Rank 42" />
            <Field label="Testimonial Text" value={t.text} onChange={v => updateItem('testimonials', i, 'text', v)} multiline />
          </div>
        ))}
        <button onClick={() => addItem('testimonials', { name: '', rank: '', text: '', city: '' })}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors">
          <Plus size={15} /> Add Testimonial
        </button>
      </Section>

      {/* ── ABOUT ── */}
      <Section title="About Section" icon={Info}>
        <Field label="Section Heading" value={data.aboutTitle} onChange={v => set('aboutTitle', v)} />
        <Field label="Paragraph 1" value={data.aboutPara1} onChange={v => set('aboutPara1', v)} multiline />
        <Field label="Paragraph 2" value={data.aboutPara2} onChange={v => set('aboutPara2', v)} multiline />

        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Bullet Points</p>
          {(data.aboutBullets || []).map((b, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input value={b} onChange={e => set('aboutBullets', (data.aboutBullets || []).map((x, idx) => idx === i ? e.target.value : x))}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={() => set('aboutBullets', (data.aboutBullets || []).filter((_, idx) => idx !== i))}
                className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
            </div>
          ))}
          <button onClick={() => set('aboutBullets', [...(data.aboutBullets || []), ''])}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            <Plus size={15} /> Add Bullet Point
          </button>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Stats Cards</p>
          {(data.aboutStats || []).map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 grid grid-cols-3 gap-2 mb-2 relative">
              <button onClick={() => removeItem('aboutStats', i)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
              <Field label="Value" value={s.value} onChange={v => updateItem('aboutStats', i, 'value', v)} placeholder="15K+" />
              <Field label="Label" value={s.label} onChange={v => updateItem('aboutStats', i, 'label', v)} placeholder="Students" />
              <Field label="Color (Tailwind)" value={s.color} onChange={v => updateItem('aboutStats', i, 'color', v)} placeholder="from-blue-500 to-indigo-600" />
            </div>
          ))}
          <button onClick={() => addItem('aboutStats', { value: '', label: '', color: 'from-blue-500 to-indigo-600' })}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            <Plus size={15} /> Add Stat Card
          </button>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Values Cards</p>
          {(data.values || []).map((v, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 space-y-2 mb-2 relative">
              <button onClick={() => removeItem('values', i)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
              <Field label="Title" value={v.title} onChange={val => updateItem('values', i, 'title', val)} />
              <Field label="Description" value={v.desc} onChange={val => updateItem('values', i, 'desc', val)} multiline />
            </div>
          ))}
          <button onClick={() => addItem('values', { title: '', desc: '' })}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            <Plus size={15} /> Add Value
          </button>
        </div>
      </Section>

      {/* ── CONTACT ── */}
      <Section title="Contact Section" icon={Phone}>
        <Field label="Section Heading" value={data.contactTitle} onChange={v => set('contactTitle', v)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone" value={data.contactPhone} onChange={v => set('contactPhone', v)} />
          <Field label="Email" value={data.contactEmail} onChange={v => set('contactEmail', v)} />
        </div>
        <Field label="Address" value={data.contactAddress} onChange={v => set('contactAddress', v)} />
        <Field label="Office Hours" value={data.contactHours} onChange={v => set('contactHours', v)} />
      </Section>

      {/* ── SAVE ── */}
      <div className="pt-2">
        <button
          onClick={save}
          disabled={saving}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm shadow-sm transition-all disabled:opacity-50 ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving…' : saved ? '✓ Saved Successfully!' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}

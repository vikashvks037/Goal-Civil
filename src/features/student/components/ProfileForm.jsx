'use client';
import { ENDPOINTS } from '@/constants';
import { useEffect, useState, useRef } from 'react';
import { Camera, Save, User } from 'lucide-react';

const EMPTY = { name: '', email: '', phone: '', city: '', state: '', qualification: '', dob: '', gender: '' };
const QUALS = ['10th','12th','Graduate','Post-Graduate','Other'];
const STATES = ['Bihar','Uttar Pradesh','Jharkhand','Delhi','West Bengal','Rajasthan','Maharashtra','Madhya Pradesh','Other'];

export function ProfileForm() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    fetch(ENDPOINTS.PROFILE).then(r => r.json()).then(d => { if (d.user) setForm(d.user); }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePic = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    const r = await fetch(ENDPOINTS.UPLOAD.PIC, { method: 'POST', body: fd }).then(x => x.json());
    if (r.url) setForm(f => ({ ...f, profilePic: r.url }));
    setUploading(false);
  };

  const save = async () => {
    setSaving(true); setSaved(false);
    await fetch(ENDPOINTS.PROFILE, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="space-y-4">{[...Array(5)].map((_,i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse"/>)}</div>;

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-blue-100 overflow-hidden flex items-center justify-center">
            {form.profilePic ? <img src={form.profilePic} alt="" className="w-full h-full object-cover"/> : <User size={32} className="text-blue-400"/>}
          </div>
          <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors">
            <Camera size={13} className="text-white"/>
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePic} className="hidden"/>
        </div>
        <div>
          <p className="font-bold text-gray-900">{form.name}</p>
          <p className="text-sm text-gray-400">{form.email}</p>
          {uploading && <p className="text-xs text-blue-500 mt-0.5">Uploading…</p>}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold text-gray-800">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label:'Full Name', name:'name', type:'text' },
            { label:'Phone', name:'phone', type:'tel' },
            { label:'City', name:'city', type:'text' },
            { label:'Date of Birth', name:'dob', type:'date' },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
              <input type={type} name={name} value={form[name] || ''} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Gender</label>
            <select name="gender" value={form.gender || ''} onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="">Select</option>
              {['male','female','other'].map(g => <option key={g} value={g} className="capitalize">{g.charAt(0).toUpperCase()+g.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Qualification</label>
            <select name="qualification" value={form.qualification || ''} onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="">Select</option>
              {QUALS.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">State</label>
            <select name="state" value={form.state || ''} onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="">Select</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-blue-500/20">
        <Save size={15}/>{saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
      </button>
    </div>
  );
}


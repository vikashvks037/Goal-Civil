'use client';
import { ENDPOINTS } from '@/constants';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';

const EMPTY = { code: '', discountType: 'percent', discount: 10, maxUses: 100, isActive: true, expiresAt: '' };

export function CouponsManager() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const r = await fetch(ENDPOINTS.ADMIN.COUPONS);
    const d = await r.json();
    setCoupons(d.coupons || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const save = async () => {
    setSaving(true);
    const url = editing ? ENDPOINTS.ADMIN.COUPON_BY_ID(editing) : ENDPOINTS.ADMIN.COUPONS;
    await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, expiresAt: form.expiresAt || undefined }) });
    setSaving(false); setModal(false); fetch_();
  };

  const del = async (id) => {
    if (!confirm('Delete coupon?')) return;
    await fetch(ENDPOINTS.ADMIN.COUPON_BY_ID(id), { method: 'DELETE' });
    fetch_();
  };

  const toggle = async (c) => {
    await fetch(ENDPOINTS.ADMIN.COUPON_BY_ID(c._id), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !c.isActive }) });
    fetch_();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-gray-900">Coupons</h1></div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm">
          <Plus size={16}/> New Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading...</div> :
          coupons.length === 0 ? <div className="p-8 text-center text-gray-400">No coupons yet.</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Code', 'Type', 'Discount', 'Used / Max', 'Expires', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {coupons.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-black text-blue-600 tracking-widest">{c.code}</td>
                    <td className="px-4 py-3 capitalize text-gray-600">{c.discountType}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{c.discountType === 'percent' ? `${c.discount}%` : `₹${c.discount}`}</td>
                    <td className="px-4 py-3 text-gray-600">{c.usedCount} / {c.maxUses}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggle(c)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500">{c.isActive ? <EyeOff size={14}/> : <Eye size={14}/>}</button>
                        <button onClick={() => del(c._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-5 border-b border-gray-100"><h2 className="font-black text-gray-900">New Coupon</h2></div>
            <div className="p-5 space-y-4">
              {[{ label: 'Code (e.g. BPSC50)', key: 'code', type: 'text' }].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"/>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                  <select value={form.discountType} onChange={e => setForm(p => ({ ...p, discountType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="percent">Percent (%)</option><option value="flat">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Discount {form.discountType === 'percent' ? '(%)' : '(₹)'}</label>
                  <input type="number" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: +e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Max Uses</label>
                  <input type="number" value={form.maxUses} onChange={e => setForm(p => ({ ...p, maxUses: +e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Expires (optional)</label>
                  <input type="date" value={form.expiresAt} onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700">Cancel</button>
              <button onClick={save} disabled={saving || !form.code} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold">
                {saving ? 'Saving...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

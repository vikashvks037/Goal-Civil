'use client';
import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="card p-8 flex flex-col items-center justify-center text-center gap-3">
        <CheckCircle size={48} style={{ color: '#10b981' }} />
        <h3 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>We'll get back to you within 24 hours.</p>
        <button onClick={() => setSent(false)} className="btn-ghost text-sm mt-2">Send another</button>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-black mb-5" style={{ color: 'var(--text-primary)' }}>Send us a Message</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name *</label>
            <input
              required className="input-base"
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Rahul Kumar"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email *</label>
            <input
              required type="email" className="input-base"
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Phone</label>
          <input
            className="input-base" type="tel"
            value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Message *</label>
          <textarea
            required rows={4} className="input-base resize-none"
            value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            placeholder="How can we help you?"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
            : <><Send size={16} /> Send Message</>}
        </button>
      </form>
    </div>
  );
}

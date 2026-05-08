import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { ENDPOINTS } from '@/constants';

const LEGAL_LINKS = [
  { label: 'Privacy Policy',   href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Refund Policy',    href: '/refund' },
];

async function getSettings() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${base}${ENDPOINTS.SETTINGS}`, { next: { revalidate: 600 } });
    const data = await res.json();
    return data.settings || {};
  } catch { return {}; }
}

export default async function PageFooter() {
  const settings = await getSettings();

  const address = settings.address || 'Harrakh Kothi Road, Begusarai, Bihar 851218';
  const phone   = settings.phone   || '+91 98765 43210';
  const email   = settings.email   || 'info@goalcivil.com';

  return (
    <footer style={{ background: '#070c14', borderTop: '1px solid #1e293b' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Legal links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6">
          {LEGAL_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm transition-colors hover:text-white"
              style={{ color: '#64748b' }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Contact + copyright */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 text-xs"
          style={{ borderTop: '1px solid #1e293b', color: '#475569' }}
        >
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-1.5">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} style={{ color: '#3b82f6' }} />
              {address}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={12} style={{ color: '#3b82f6' }} />
              {phone}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={12} style={{ color: '#3b82f6' }} />
              {email}
            </span>
          </div>
          <p className="flex-shrink-0">© {new Date().getFullYear()} Goal Civil. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}

import { connectDB } from '@/lib/mongodb';
import { IndianRupee, TrendingUp } from 'lucide-react';
import { Breadcrumbs, StatCard } from '@/shared/components';
import { ROUTES } from '@/constants';

async function getPayments() {
  try {
    await connectDB();
    const Payment = (await import('@/server/db/models/Payment')).default;
    const payments = await Payment.find({ status: 'success' })
      .sort({ createdAt: -1 }).limit(100)
      .populate('studentId', 'name email')
      .populate('courseId', 'title')
      .lean();
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    return { payments, totalRevenue };
  } catch { return { payments: [], totalRevenue: 0 }; }
}

export default async function AdminPaymentsPage() {
  const { payments, totalRevenue } = await getPayments();

  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Admin',    href: ROUTES.ADMIN.DASHBOARD },
          { label: 'Payments' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<IndianRupee size={22}/>} label="Total Revenue" value={`₹${(totalRevenue/100).toLocaleString('en-IN')}`} color="bg-green-50 text-green-600"/>
        <StatCard icon={<TrendingUp size={22}/>} label="Transactions" value={payments.length} color="bg-blue-50 text-blue-600"/>
        <StatCard icon={<IndianRupee size={22}/>} label="Avg. Order Value" value={payments.length ? `₹${Math.round(totalRevenue/100/payments.length).toLocaleString('en-IN')}` : '—'} color="bg-violet-50 text-violet-600"/>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th><th>Course</th><th>Amount</th><th>Payment ID</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10" style={{ color: 'var(--text-muted)' }}>No payments yet.</td></tr>
            ) : payments.map((p) => (
              <tr key={p._id}>
                <td>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{p.studentId?.name || '—'}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.studentId?.email}</p>
                </td>
                <td><span className="text-sm line-clamp-1" style={{ color: 'var(--text-secondary)' }}>{p.courseId?.title || '—'}</span></td>
                <td><span className="font-bold text-sm" style={{ color: '#10b981' }}>₹{(p.amount/100).toLocaleString()}</span></td>
                <td><span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{p.razorpayPaymentId?.slice(-10) || '—'}</span></td>
                <td><span className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(p.createdAt).toLocaleDateString('en-IN')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { connectDB } from '@/lib/mongodb';
import { BarChart2, TrendingUp, Users, IndianRupee } from 'lucide-react';
import { Breadcrumbs, StatCard } from '@/shared/components';
import { ROUTES } from '@/constants';

async function getAnalytics() {
  try {
    await connectDB();
    const [User, Payment, Enrollment, Result] = await Promise.all([
      import('@/server/db/models/User').then(m => m.default),
      import('@/server/db/models/Payment').then(m => m.default),
      import('@/server/db/models/Enrollment').then(m => m.default),
      import('@/server/db/models/Result').then(m => m.default),
    ]);
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return { label: d.toLocaleString('en-IN', { month: 'short', year: '2-digit' }), start: d, end: new Date(d.getFullYear(), d.getMonth() + 1, 1) };
    }).reverse();

    const monthlyData = await Promise.all(months.map(async m => {
      const [students, revenue] = await Promise.all([
        User.countDocuments({ role: 'student', createdAt: { $gte: m.start, $lt: m.end } }),
        Payment.aggregate([{ $match: { status: 'success', createdAt: { $gte: m.start, $lt: m.end } } }, { $group: { _id: null, t: { $sum: '$amount' } } }]),
      ]);
      return { label: m.label, students, revenue: (revenue[0]?.t || 0) / 100 };
    }));

    const [totalStudents, totalRevenue, totalEnrollments] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Payment.aggregate([{ $match: { status: 'success' } }, { $group: { _id: null, t: { $sum: '$amount' } } }]),
      Enrollment.countDocuments({ status: 'active' }),
    ]);

    return { monthlyData, totalStudents, totalRevenue: (totalRevenue[0]?.t || 0) / 100, totalEnrollments };
  } catch { return { monthlyData: [], totalStudents: 0, totalRevenue: 0, totalEnrollments: 0 }; }
}

export default async function AdminAnalyticsPage() {
  const { monthlyData, totalStudents, totalRevenue, totalEnrollments } = await getAnalytics();

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: 'Admin', href: ROUTES.ADMIN.DASHBOARD }, { label: 'Analytics' }]} />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={<Users size={22}/>}        label="Total Students"  value={totalStudents}                                          color="bg-blue-50 text-blue-600"/>
        <StatCard icon={<IndianRupee size={22}/>}  label="Total Revenue"   value={`₹${totalRevenue.toLocaleString('en-IN')}`}             color="bg-green-50 text-green-600"/>
        <StatCard icon={<TrendingUp size={22}/>}   label="Active Enrolments" value={totalEnrollments}                                     color="bg-violet-50 text-violet-600"/>
      </div>

      {/* Monthly trend table */}
      <div className="card p-5">
        <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>📈 Monthly Growth (Last 6 Months)</h3>
        <div className="table-wrapper" style={{ border: 'none', boxShadow: 'none' }}>
          <table className="data-table">
            <thead><tr><th>Month</th><th>New Students</th><th>Revenue</th></tr></thead>
            <tbody>
              {monthlyData.map(m => (
                <tr key={m.label}>
                  <td><span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{m.label}</span></td>
                  <td><span className="text-sm" style={{ color: 'var(--text-secondary)' }}>+{m.students}</span></td>
                  <td><span className="font-bold text-sm" style={{ color: '#10b981' }}>₹{m.revenue.toLocaleString('en-IN')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

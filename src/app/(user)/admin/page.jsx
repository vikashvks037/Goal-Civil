import {
  Users, BookOpen, FileText, TrendingUp, IndianRupee,
  UserPlus, BarChart2, Star
} from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import { StatCard, PageHeader } from '@/shared/components';

async function getAnalyticsData() {
  try {
    await connectDB();
    const [User, Course, Test, Enrollment, Payment] = await Promise.all([
      import('@/server/db/models/User').then(m => m.default),
      import('@/server/db/models/Course').then(m => m.default),
      import('@/server/db/models/Test').then(m => m.default),
      import('@/server/db/models/Enrollment').then(m => m.default),
      import('@/server/db/models/Payment').then(m => m.default),
    ]);
    const now        = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const [
      totalStudents, totalCourses, totalTests, totalEnrollments,
      newStudentsThisMonth, revenueAgg, topCourses, recentPayments,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments({ isPublished: true }),
      Test.countDocuments({ isPublished: true }),
      Enrollment.countDocuments({ status: 'active' }),
      User.countDocuments({ role: 'student', createdAt: { $gte: monthStart } }),
      Payment.aggregate([{ $match: { status: 'success' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Course.find({ isPublished: true }).sort({ enrolledCount: -1 }).limit(5).select('title enrolledCount').lean(),
      Payment.find({ status: 'success' }).sort({ createdAt: -1 }).limit(5)
        .populate('studentId', 'name').populate('courseId', 'title').lean(),
    ]);
    return {
      stats: { totalStudents, totalCourses, totalTests, totalEnrollments, newStudentsThisMonth, totalRevenue: revenueAgg[0]?.total ?? 0 },
      topCourses, recentPayments,
    };
  } catch {
    return { stats: null, topCourses: [], recentPayments: [] };
  }
}

export default async function AdminDashboardPage() {
  const { stats, topCourses, recentPayments } = await getAnalyticsData();

  const statItems = [
    { icon: <Users size={22}/>,       label: 'Total Students',  value: stats?.totalStudents ?? 0,                                            color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { icon: <BookOpen size={22}/>,    label: 'Total Courses',   value: stats?.totalCourses ?? 0,                                             color: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400' },
    { icon: <FileText size={22}/>,    label: 'Total Tests',     value: stats?.totalTests ?? 0,                                               color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    { icon: <TrendingUp size={22}/>,  label: 'Enrollments',     value: stats?.totalEnrollments ?? 0,                                         color: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
    { icon: <IndianRupee size={22}/>, label: 'Total Revenue',   value: `₹${((stats?.totalRevenue ?? 0) / 100).toLocaleString('en-IN')}`,     color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { icon: <UserPlus size={22}/>,    label: 'New This Month',  value: stats?.newStudentsThisMonth ?? 0,  sub: 'Students registered',         color: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400' },
    { icon: <BarChart2 size={22}/>,   label: 'Avg Test Score',  value: '—',                                                                  color: 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
    { icon: <Star size={22}/>,        label: 'Active Courses',  value: stats?.totalCourses ?? 0,                                             color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Dashboard" subtitle="Overview of your platform today" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {statItems.map((s, i) => (
          <div key={i} className="animate-fade-in-up">
            <StatCard {...s} />
          </div>
        ))}
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Top courses */}
        <div className="card p-5">
          <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            🏆 Top Courses by Enrollment
          </h3>
          {topCourses.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No courses yet.</p>
          ) : (
            <div className="space-y-3">
              {topCourses.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{
                      background: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7f32' : 'var(--bg-surface-2)',
                      color: i < 3 ? '#fff' : 'var(--text-secondary)',
                    }}
                  >
                    {i + 1}
                  </span>
                  <p className="flex-1 text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{c.title}</p>
                  <span className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>{c.enrolledCount}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent payments */}
        <div className="card p-5">
          <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            💳 Recent Payments
          </h3>
          {recentPayments.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No payments yet.</p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((p) => (
                <div key={p._id} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0"
                    style={{ background: 'rgba(16,185,129,0.12)' }}
                  >
                    ₹
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{p.studentId?.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{p.courseId?.title}</p>
                  </div>
                  <span className="text-sm font-black" style={{ color: '#10b981' }}>
                    ₹{(p.amount / 100).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

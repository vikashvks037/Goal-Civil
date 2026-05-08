import {
  Users, BookOpen, FileText, IndianRupee,
  Newspaper, Radio, Tag, Bell
} from 'lucide-react';
import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import { StatCard } from '@/shared/components';

// Static imports for models
import User from '@/server/db/models/User';
import Course from '@/server/db/models/Course';
import Test from '@/server/db/models/Test';
import Payment from '@/server/db/models/Payment';
import { CurrentAffairs, LiveClass, Coupon, Notice } from '@/server/db/models/Other';

async function getAnalyticsData() {
  try {
    await connectDB();
    
    const [
      totalStudents, totalCourses, totalTests,
      revenueAgg, totalAffairs, totalLive, totalCoupons, totalNotices,
      upcomingClasses, recentPayments,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments({ isPublished: true }),
      Test.countDocuments({ isPublished: true }),
      Payment.aggregate([{ $match: { status: 'success' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      CurrentAffairs.countDocuments({ isPublished: true }),
      LiveClass.countDocuments({ status: 'scheduled' }),
      Coupon.countDocuments({ isActive: true }),
      Notice.countDocuments({ isActive: true }),
      LiveClass.find({ status: { $in: ['scheduled', 'live'] } }).sort({ scheduledAt: 1 }).limit(5).populate('courseId', 'title').lean(),
      Payment.find({ status: 'success' }).sort({ createdAt: -1 }).limit(5)
        .populate('studentId', 'name').populate('courseId', 'title').lean(),
    ]);

    return {
      stats: {
        totalStudents, totalCourses, totalTests,
        totalRevenue: revenueAgg[0]?.total ?? 0,
        totalAffairs, totalLive, totalCoupons, totalNotices
      },
      upcomingClasses, recentPayments,
    };
  } catch (error) {
    console.error("Dashboard data error:", error);
    return { stats: null, upcomingClasses: [], recentPayments: [] };
  }
}

export default async function AdminDashboardPage() {
  const { stats, upcomingClasses, recentPayments } = await getAnalyticsData();

  const statItems = [
    { icon: <Users size={20} />,       label: 'Students',        value: stats?.totalStudents ?? 0,                                            color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', href: '/admin/users' },
    { icon: <BookOpen size={20} />,    label: 'Courses',         value: stats?.totalCourses ?? 0,                                             color: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400', href: '/admin/courses' },
    { icon: <FileText size={20} />,    label: 'Tests',           value: stats?.totalTests ?? 0,                                               color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', href: '/admin/tests' },
    { icon: <IndianRupee size={20} />, label: 'Revenue',         value: `₹${((stats?.totalRevenue ?? 0) / 100).toLocaleString('en-IN')}`,     color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', href: '/admin/payments' },
    { icon: <Newspaper size={20} />,   label: 'Affairs',         value: stats?.totalAffairs ?? 0,                                             color: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400', href: '/admin/current-affairs' },
    { icon: <Radio size={20} />,       label: 'Live Classes',    value: stats?.totalLive ?? 0,                                                color: 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400', href: '/admin/live-classes' },
    { icon: <Tag size={20} />,         label: 'Coupons',         value: stats?.totalCoupons ?? 0,                                             color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400', href: '/admin/coupons' },
    { icon: <Bell size={20} />,        label: 'Notices',         value: stats?.totalNotices ?? 0,                                             color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400', href: '/admin/notices' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pt-2">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {statItems.map((s, i) => (
          <div key={i} className="animate-fade-in-up">
            <StatCard {...s} />
          </div>
        ))}
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Upcoming Classes */}
        <div className="card p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Radio size={18} className="text-red-500 animate-pulse" />
            Upcoming Live Classes
          </h3>
          {upcomingClasses.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No live classes scheduled.</p>
          ) : (
            <div className="space-y-3">
              {upcomingClasses.map((lc) => (
                <Link href={`/admin/live-classes`} key={lc._id} className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase">{new Date(lc.scheduledAt).toLocaleString('en-US', { month: 'short' })}</span>
                    <span className="text-sm font-black leading-none">{new Date(lc.scheduledAt).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate min-w-0 group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-primary)' }}>{lc.title}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                      {lc.courseId?.title ?? 'General Class'} • {new Date(lc.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {lc.status === 'live' && (
                    <span className="badge bg-red-500 text-white animate-pulse">LIVE</span>
                  )}
                </Link>
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
                <Link href={`/admin/payments`} key={p._id} className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0"
                    style={{ background: 'rgba(16,185,129,0.12)' }}
                  >
                    ₹
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate min-w-0 group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-primary)' }}>{p.studentId?.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{p.courseId?.title}</p>
                  </div>
                  <span className="text-sm font-black" style={{ color: '#10b981' }}>
                    ₹{(p.amount / 100).toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

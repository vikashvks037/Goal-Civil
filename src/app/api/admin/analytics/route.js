import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import User from '@/server/db/models/User';
import Course from '@/server/db/models/Course';
import Payment from '@/server/db/models/Payment';
import Enrollment from '@/server/db/models/Enrollment';
import Result from '@/server/db/models/Result';
import Test from '@/server/db/models/Test';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return { year: d.getFullYear(), month: d.getMonth() };
    }).reverse();

    const [
      totalStudents,
      totalCourses,
      totalTests,
      totalEnrollments,
      newStudentsThisMonth,
      payments,
      recentPayments,
      recentEnrollments,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments(),
      Test.countDocuments(),
      Enrollment.countDocuments({ status: 'active' }),
      User.countDocuments({ role: 'student', createdAt: { $gte: startOfMonth } }),
      Payment.find({ status: 'success' }).select('amount createdAt'),
      Payment.find({ status: 'success' }).sort({ createdAt: -1 }).limit(5)
        .populate('studentId', 'name email').populate('courseId', 'title'),
      Enrollment.find().sort({ createdAt: -1 }).limit(5)
        .populate('studentId', 'name').populate('courseId', 'title'),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount / 100, 0);

    // Monthly revenue chart (last 6 months)
    const revenueByMonth = await Promise.all(
      last6Months.map(async ({ year, month }) => {
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 1);
        const monthPayments = await Payment.find({ status: 'success', createdAt: { $gte: start, $lt: end } }).select('amount');
        const revenue = monthPayments.reduce((s, p) => s + p.amount / 100, 0);
        return {
          month: start.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
          revenue,
        };
      })
    );

    // Enrollments by month
    const enrollmentsByMonth = await Promise.all(
      last6Months.map(async ({ year, month }) => {
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 1);
        const count = await Enrollment.countDocuments({ createdAt: { $gte: start, $lt: end } });
        return {
          month: start.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
          count,
        };
      })
    );

    // Top courses by enrollment
    const topCourses = await Course.find().sort({ enrolledCount: -1 }).limit(5).select('title enrolledCount');

    // Average test score
    const avgScoreResult = await Result.aggregate([{ $group: { _id: null, avg: { $avg: '$percentage' } } }]);
    const avgScore = avgScoreResult[0]?.avg?.toFixed(1) || 0;

    return NextResponse.json({
      stats: { totalStudents, totalCourses, totalTests, totalEnrollments, newStudentsThisMonth, totalRevenue, avgScore },
      charts: { revenueByMonth, enrollmentsByMonth },
      topCourses,
      recentPayments,
      recentEnrollments,
    });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

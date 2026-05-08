import { connectDB } from '@/lib/mongodb';
export async function getStudentPayments(studentId){ await connectDB(); const P=(await import('@/server/db/models/Payment')).default; return P.find({studentId}).sort({createdAt:-1}).populate('courseId').lean(); }
export async function getEnrollmentStatus(studentId,courseId){ await connectDB(); const E=(await import('@/server/db/models/Enrollment')).default; return E.findOne({studentId,courseId,status:'active'}).lean(); }

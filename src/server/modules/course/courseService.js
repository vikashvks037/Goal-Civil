import { connectDB } from '@/lib/mongodb';
export async function getPublishedCourses(){ await connectDB(); const C=(await import('@/server/db/models/Course')).default; return C.find({isPublished:true}).sort({enrolledCount:-1}).lean(); }
export async function getCourseBySlug(slug){ await connectDB(); const C=(await import('@/server/db/models/Course')).default; return C.findOne({slug,isPublished:true}).lean(); }

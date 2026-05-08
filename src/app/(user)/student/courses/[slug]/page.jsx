import { ENDPOINTS } from '@/constants';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, Clock, Users, ChevronDown, Play, FileText, Video, CheckCircle } from 'lucide-react';
import CourseEnrollButton from '@/features/course/components/CourseEnrollButton';

async function getCourse(slug) {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${base}${ENDPOINTS.COURSES.BY_SLUG(slug)}`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const data = await getCourse(slug);
  if (!data) notFound();

  const { course, curriculum } = data;
  const totalContent = curriculum?.reduce((s, sub) =>
    s + sub.chapters.reduce((cs, ch) => cs + (ch.contents?.length || 0), 0), 0) || 0;

  const typeIcon = (type) => {
    if (type === 'video') return <Play size={13} className="text-blue-500"/>;
    if (type === 'pdf')   return <FileText size={13} className="text-red-500"/>;
    return <Video size={13} className="text-green-500"/>;
  };

  return (
    <div className="min-h-screen bg-gray-50 -m-4 md:-m-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {course.category && <p className="text-blue-400 text-sm font-bold mb-3">{course.category}</p>}
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">{course.title}</h1>
            {course.shortDesc && <p className="text-slate-400 text-lg mb-6">{course.shortDesc}</p>}
            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400">
              {course.totalLectures > 0 && <span className="flex items-center gap-1.5"><BookOpen size={14}/> {course.totalLectures} lectures</span>}
              {course.totalDuration > 0 && <span className="flex items-center gap-1.5"><Clock size={14}/> {Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m</span>}
              {course.enrolledCount > 0 && <span className="flex items-center gap-1.5"><Users size={14}/> {course.enrolledCount.toLocaleString()} students</span>}
              {course.language && <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs font-semibold text-slate-300">{course.language}</span>}
            </div>
          </div>

          {/* Enrollment card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 h-fit">
            {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover rounded-xl mb-4"/>}
            <div className="text-3xl font-black text-gray-900 mb-1">
              {course.isFree ? <span className="text-green-600">Free</span> : `₹${course.price.toLocaleString()}`}
            </div>
            {!course.isFree && course.price > 0 && <p className="text-xs text-gray-400 mb-4">One-time payment · Lifetime access</p>}
            <CourseEnrollButton courseId={course._id} courseSlug={course.slug} price={course.price} isFree={course.isFree}/>
            <ul className="mt-5 space-y-2">
              {['Lifetime access', 'All video lectures', 'PDF study material', 'Mock tests included', 'Certificate on completion'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0"/>{f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          {course.description && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-3">About this Course</h2>
              <p className="text-gray-600 leading-relaxed">{course.description}</p>
            </div>
          )}

          {/* Curriculum */}
          {curriculum?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-black text-gray-900">Course Curriculum</h2>
                <p className="text-gray-500 text-sm mt-1">{curriculum.length} subjects · {totalContent} lessons</p>
              </div>

              <div className="divide-y divide-gray-100">
                {curriculum.map((subject) => (
                  <details key={subject._id} className="group">
                    <summary className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-gray-50 list-none">
                      <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0"/>
                      <span className="font-bold text-gray-800 flex-1">{subject.title}</span>
                      <span className="text-xs text-gray-400">{subject.chapters.length} chapters</span>
                    </summary>
                    <div className="bg-gray-50 border-t border-gray-100">
                      {subject.chapters.map(chapter => (
                        <div key={chapter._id} className="border-b border-gray-100 last:border-0">
                          <div className="px-10 py-3 flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700">{chapter.title}</span>
                            <span className="text-xs text-gray-400 ml-auto">{chapter.contents.length} lessons</span>
                          </div>
                          {chapter.contents.map(content => (
                            <div key={content._id} className="px-14 py-2 flex items-center gap-3 text-sm text-gray-600">
                              {typeIcon(content.type)}
                              <span className="flex-1 truncate">{content.title}</span>
                              {content.isFree && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Preview</span>}
                              {content.duration && <span className="text-xs text-gray-400">{content.duration}m</span>}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — sticky on lg */}
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">This course includes:</h3>
            <ul className="space-y-3">
              {[
                { icon: <BookOpen size={16} className="text-blue-500"/>, text: `${course.totalLectures || 0} video lectures` },
                { icon: <FileText size={16} className="text-red-500"/>, text: 'PDF study notes' },
                { icon: <CheckCircle size={16} className="text-green-500"/>, text: 'Mock tests & quizzes' },
                { icon: <Clock size={16} className="text-amber-500"/>, text: 'Lifetime access' },
                { icon: <Users size={16} className="text-violet-500"/>, text: 'Community support' },
              ].map(({ icon, text }, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">{icon} {text}</li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-gray-100">
              <CourseEnrollButton courseId={course._id} courseSlug={course.slug} price={course.price} isFree={course.isFree}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

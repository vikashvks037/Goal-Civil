'use client';
import { ENDPOINTS, ROUTES } from '@/constants';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, PlayCircle, FileText, Video, ChevronDown, ChevronRight, Lock, CheckCircle, Loader2, ExternalLink } from 'lucide-react';

export default function CoursePlayer() {
  const { courseId } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeContent, setActiveContent] = useState(null);
  const [enrolled, setEnrolled] = useState(null);

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    try {
      // Check enrollment
      const enrollRes = await fetch(ENDPOINTS.ENROLLMENTS.CHECK(courseId));
      const enrollData = await enrollRes.json();
      setEnrolled(enrollData.enrolled);

      if (!enrollData.enrolled) { setLoading(false); return; }

      // Fetch course + subjects
      const [cRes, sRes] = await Promise.all([
        fetch(ENDPOINTS.COURSES.BY_SLUG(courseId)),
        fetch(ENDPOINTS.ADMIN.COURSE_SUBJECTS(courseId)),
      ]);
      const cData = await cRes.json();
      const sData = await sRes.json();
      setCourse(cData.course);

      // Load chapters + content for each subject
      const subjectsWithChapters = await Promise.all(
        (sData.subjects || []).map(async (sub) => {
          const chapRes = await fetch(ENDPOINTS.ADMIN.SUBJECT_CHAPTERS(sub._id));
          const chapData = await chapRes.json();
          const chapters = await Promise.all(
            (chapData.chapters || []).map(async (chap) => {
              const contRes = await fetch(ENDPOINTS.ADMIN.CHAPTER_CONTENT(chap._id));
              const contData = await contRes.json();
              return { ...chap, contents: contData.contents || [], expanded: false };
            })
          );
          return { ...sub, chapters, expanded: true };
        })
      );
      setSubjects(subjectsWithChapters);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { fetchCourse(); }, [fetchCourse]);

  const toggleSubject = (sId) => {
    setSubjects(prev => prev.map(s => s._id === sId ? { ...s, expanded: !s.expanded } : s));
  };

  const toggleChapter = (sId, cId) => {
    setSubjects(prev => prev.map(s =>
      s._id === sId
        ? { ...s, chapters: s.chapters?.map(c => c._id === cId ? { ...c, expanded: !c.expanded } : c) }
        : s
    ));
  };

  const contentIcon = (type) => {
    if (type === 'video') return <Video className="w-4 h-4 text-blue-500" />;
    if (type === 'pdf') return <FileText className="w-4 h-4 text-red-500" />;
    return <ExternalLink className="w-4 h-4 text-green-500" />;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  if (enrolled === false) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Lock className="w-12 h-12 text-gray-300 dark:text-gray-600" />
      <p className="text-gray-500 dark:text-gray-400 font-semibold">You are not enrolled in this course.</p>
      <button onClick={() => router.push(ROUTES.STUDENT.MY_COURSES)}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors">
        Go to My Courses
      </button>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 xl:w-96 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col lg:h-screen lg:sticky lg:top-0">
        {/* Course Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="font-black text-gray-900 dark:text-white text-base leading-tight">{course?.title}</h1>
        </div>

        {/* Content Tree */}
        <div className="flex-1 overflow-y-auto">
          {subjects.map((sub) => (
            <div key={sub._id}>
              <button onClick={() => toggleSubject(sub._id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800">
                {sub.expanded ? <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{sub.title}</span>
              </button>

              {sub.expanded && sub.chapters?.map((chap) => (
                <div key={chap._id}>
                  <button onClick={() => toggleChapter(sub._id, chap._id)}
                    className="w-full flex items-center gap-3 pl-8 pr-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    {chap.expanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold">{chap.title}</span>
                  </button>

                  {chap.expanded && chap.contents?.map((content) => (
                    <button key={content._id} onClick={() => setActiveContent(content)}
                      className={`w-full flex items-center gap-3 pl-12 pr-4 py-2.5 text-left transition-colors ${
                        activeContent?._id === content._id
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-r-2 border-blue-600'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}>
                      {contentIcon(content.type)}
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex-1 truncate">{content.title}</span>
                      {content.duration ? <span className="text-xs text-gray-400 flex-shrink-0">{content.duration}m</span> : null}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Player */}
      <main className="flex-1 p-6">
        {!activeContent ? (
          <div className="flex flex-col items-center justify-center h-full min-h-64 gap-4 text-center">
            <PlayCircle className="w-16 h-16 text-gray-200 dark:text-gray-700" />
            <p className="text-gray-400 dark:text-gray-600 font-semibold">Select a lesson from the sidebar to start learning</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">{activeContent.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg">{activeContent.type}</span>
                {activeContent.duration && <span className="text-xs text-gray-400">{activeContent.duration} min</span>}
                {activeContent.isFree && <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-lg">Free Preview</span>}
              </div>
            </div>

            {/* Video Player */}
            {activeContent.type === 'video' && activeContent.url && (
              <div className="rounded-2xl overflow-hidden bg-black aspect-video mb-4">
                {activeContent.url.includes('cloudinary') ? (
                  <video controls className="w-full h-full" src={activeContent.url}>
                    Your browser does not support video.
                  </video>
                ) : (
                  <iframe
                    src={activeContent.url.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                )}
              </div>
            )}

            {/* PDF Viewer */}
            {activeContent.type === 'pdf' && activeContent.url && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-4 bg-white dark:bg-gray-900">
                <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">PDF Document</span>
                  <a href={activeContent.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Open in new tab <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <iframe src={`${activeContent.url}#toolbar=0`} className="w-full h-[600px]" />
              </div>
            )}

            {/* Live / External Link */}
            {activeContent.type === 'live' && activeContent.url && (
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center bg-white dark:bg-gray-900">
                <ExternalLink className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-700 dark:text-gray-300 font-semibold mb-4">This is a live/external class link</p>
                <a href={activeContent.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition-colors">
                  Join Class <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            <div className="flex items-center gap-2 mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-green-700 dark:text-green-400 font-medium">Mark as complete when done to track your progress.</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

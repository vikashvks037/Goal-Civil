'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Users, Clock, Zap } from 'lucide-react';

const URGENCY = [
  { text: '🔥 Limited Seats', color: '#ef4444' },
  { text: '⏳ Offer Ends Soon', color: '#f59e0b' },
  { text: '🚀 Batch Starting', color: '#6366f1' },
  { text: '🎯 Enroll Now', color: '#10b981' },
];

export function CourseCard({ course: c, href, showTimer = false, ctaLabel = 'Enroll Now' }) {
  const [timerIdx, setTimerIdx] = useState(0);

  useEffect(() => {
    if (!showTimer) return;
    const id = setInterval(() => setTimerIdx(i => (i + 1) % URGENCY.length), 3000);
    return () => clearInterval(id);
  }, [showTimer]);

  const destination = href ?? `/student/courses/${c.slug}`;
  const urgency = URGENCY[timerIdx];

  return (
    <Link href={destination} className="course-card group">
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ height: '180px', background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
        {c.thumbnail
          ? <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen size={48} style={{ color: 'rgba(255,255,255,0.25)' }} />
            </div>
          )
        }

        {/* Overlay gradient */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />

        {/* Free badge */}
        {c.isFree && (
          <span className="absolute top-3 left-3 badge text-white" style={{ background: '#10b981', fontSize: '0.7rem' }}>
            FREE
          </span>
        )}

        {/* Tag / Timer */}
        {showTimer ? (
          <span
            className="absolute top-3 right-3 badge text-white animate-pulse"
            style={{ background: urgency.color, fontSize: '0.7rem' }}
          >
            {urgency.text}
          </span>
        ) : c.tag ? (
          <span className="absolute top-3 right-3 badge" style={{ background: '#f59e0b', color: '#78350f', fontSize: '0.7rem' }}>
            {c.tag}
          </span>
        ) : null}

        {/* Language */}
        {c.language && (
          <span
            className="absolute bottom-3 right-3 badge text-white"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', fontSize: '0.65rem' }}
          >
            {c.language}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        {c.category && (
          <p className="text-xs font-bold mb-1.5" style={{ color: 'var(--brand-600)' }}>{c.category}</p>
        )}
        <h3
          className="font-bold leading-snug line-clamp-2 mb-2 transition-colors group-hover:text-blue-600"
          style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}
        >
          {c.title}
        </h3>
        {c.shortDesc && (
          <p className="text-sm line-clamp-2 mb-3 flex-1" style={{ color: 'var(--text-muted)' }}>{c.shortDesc}</p>
        )}

        {/* Meta */}
        <div className="flex items-center flex-wrap gap-3 mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          {c.totalLectures   ? <span className="flex items-center gap-1"><BookOpen size={11} />{c.totalLectures} lectures</span> : null}
          {c.enrolledCount   ? <span className="flex items-center gap-1"><Users size={11} />{c.enrolledCount.toLocaleString()} students</span> : null}
          {c.totalDuration   ? <span className="flex items-center gap-1"><Clock size={11} />{Math.floor(c.totalDuration / 60)}h</span> : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <span className="font-black text-lg" style={{ color: 'var(--text-primary)' }}>
            {c.isFree ? <span style={{ color: '#10b981' }}>Free</span> : `₹${c.price?.toLocaleString()}`}
          </span>
          <span
            className="btn-primary text-xs px-3 py-1.5"
            style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem' }}
          >
            {ctaLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

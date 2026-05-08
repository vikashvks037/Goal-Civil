'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { BookOpen, Users, Clock, ChevronLeft, ChevronRight, IndianRupee } from 'lucide-react';

export function CourseCarousel({ courses, loginHref }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = courses.length;

  const next = useCallback(() => setActive(i => (i + 1) % total), [total]);
  const prev = useCallback(() => setActive(i => (i - 1 + total) % total), [total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(next, 3000);
    return () => clearInterval(id);
  }, [paused, next, total]);

  if (total === 0) return null;

  const c = courses[active];

  return (
    <div
      className="relative bg-white/5 backdrop-blur-md  rounded-3xl p-5 "
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Course thumbnail */}
      <div className="relative h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 mb-4">
        {c.thumbnail
          ? <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover"/>
          : <div className="w-full h-full flex items-center justify-center"><BookOpen size={48} className="text-white/30"/></div>
        }
        {c.tag && (
          <span className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-xs font-black px-2.5 py-1 rounded-full">
            {c.tag}
          </span>
        )}
        {c.isFree && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-black px-2.5 py-1 rounded-full">
            FREE
          </span>
        )}
        {c.language && (
          <span className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {c.language}
          </span>
        )}
      </div>

      {/* Course info */}
      <div className="mb-4">
        {c.category && <p className="text-blue-400 text-xs font-bold mb-1">{c.category}</p>}
        <h3 className="text-white font-black text-base leading-snug mb-1 line-clamp-2">{c.title}</h3>
        {c.shortDesc && <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{c.shortDesc}</p>}
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
          {c.totalLectures && <span className="flex items-center gap-1"><BookOpen size={10}/> {c.totalLectures} lectures</span>}
          {c.enrolledCount && <span className="flex items-center gap-1"><Users size={10}/> {c.enrolledCount.toLocaleString()} students</span>}
          {c.totalDuration && <span className="flex items-center gap-1"><Clock size={10}/> {Math.floor(c.totalDuration / 60)}h</span>}
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-white font-black text-xl">
          {c.isFree
            ? <span className="text-green-400">Free</span>
            : <span className="flex items-center gap-0.5"><IndianRupee size={16}/>{c.price.toLocaleString()}</span>
          }
        </div>
        <Link
          href={loginHref}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-all hover:scale-105"
        >
          Enroll Now →
        </Link>
      </div>

      {/* Controls + dots */}
      <div className="flex items-center justify-between">
        
        <div className="flex items-center">
          {courses.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${i === active ? 'w-5 h-2 bg-blue-400' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

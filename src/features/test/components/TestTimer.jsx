'use client';
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export function TestTimer({durationSeconds,onExpire}){
  const [rem,setRem]=useState(durationSeconds);
  useEffect(()=>{ if(rem<=0){onExpire();return;} const t=setInterval(()=>setRem(r=>r-1),1000); return()=>clearInterval(t); },[rem,onExpire]);
  const m=Math.floor(rem/60).toString().padStart(2,'0');
  const s=(rem%60).toString().padStart(2,'0');
  const urgent=rem<300;
  return <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${urgent?'bg-red-50 text-red-600':'bg-blue-50 text-blue-700'}`}><Clock size={15} className={urgent?'animate-pulse':''}/>{m}:{s}</div>;
}

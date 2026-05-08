'use client';
import { ENDPOINTS, ROUTES } from '@/constants';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, MinusCircle, Trophy, Clock, ArrowLeft } from 'lucide-react';

export function ResultDetail() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    fetch(ENDPOINTS.STUDENT.RESULT_BY_ID(id))
      .then(r => r.json())
      .then(d => { setResult(d.result); setAnalysis(d.analysis || []); setLoading(false); });
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading result...</div>;
  if (!result) return <div className="bg-red-50 rounded-xl p-6 text-red-600">Result not found.</div>;

  const correct = analysis.filter(a => a.isCorrect).length;
  const wrong = analysis.filter(a => !a.isCorrect && a.selected !== null).length;
  const skipped = analysis.filter(a => a.selected === null).length;
  const passed = result.percentage >= (result.testId?.passingMarks || 0);
  const formatTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <Link href={ROUTES.STUDENT.RESULTS} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-semibold">
        <ArrowLeft size={16}/> Back to Results
      </Link>

      <div className={`rounded-2xl p-6 text-white ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm opacity-80 font-medium">{result.testId?.title}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black">{result.percentage.toFixed(1)}%</span>
            </div>
            <p className="text-sm opacity-80 mt-1">{result.score} / {result.totalMarks} marks</p>
            <div className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-black ${passed ? 'bg-white/20' : 'bg-white/20'}`}>
              {passed ? '✅ Passed' : '❌ Failed'}
            </div>
          </div>
          <div className="text-right">
            {result.rank && (
              <div className="flex items-center gap-1 bg-white/20 rounded-xl px-3 py-2">
                <Trophy size={16}/>
                <span className="font-black">Rank #{result.rank}</span>
              </div>
            )}
            <p className="text-sm opacity-70 mt-2 flex items-center gap-1 justify-end"><Clock size={12}/> {formatTime(result.timeTaken)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Correct', value: correct, color: 'bg-green-50 text-green-700', icon: <CheckCircle size={18}/> },
          { label: 'Wrong', value: wrong, color: 'bg-red-50 text-red-600', icon: <XCircle size={18}/> },
          { label: 'Skipped', value: skipped, color: 'bg-gray-50 text-gray-600', icon: <MinusCircle size={18}/> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className={`rounded-xl p-4 ${color} flex flex-col items-center gap-1`}>
            {icon}
            <span className="text-2xl font-black">{value}</span>
            <span className="text-xs font-semibold">{label}</span>
          </div>
        ))}
      </div>

      <button onClick={() => setShowAnalysis(p => !p)}
        className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors">
        {showAnalysis ? 'Hide' : 'Show'} Question Analysis ({analysis.length} questions)
      </button>

      {showAnalysis && (
        <div className="space-y-4">
          {analysis.map((item, i) => {
            if (!item.question) return null;
            const q = item.question;
            const isSkipped = item.selected === null;
            const border = item.isCorrect ? 'border-green-200' : isSkipped ? 'border-gray-200' : 'border-red-200';
            const bg = item.isCorrect ? 'bg-green-50' : isSkipped ? 'bg-gray-50' : 'bg-red-50';

            return (
              <div key={q._id} className={`rounded-xl border-2 ${border} overflow-hidden`}>
                <div className={`px-4 py-2 ${bg} flex items-center justify-between`}>
                  <span className="text-xs font-bold text-gray-600">Q{i + 1}</span>
                  <div className="flex items-center gap-2">
                    {item.isCorrect ? <CheckCircle size={14} className="text-green-600"/> : isSkipped ? <MinusCircle size={14} className="text-gray-400"/> : <XCircle size={14} className="text-red-500"/>}
                    <span className={`text-xs font-bold ${item.isCorrect ? 'text-green-600' : isSkipped ? 'text-gray-500' : 'text-red-600'}`}>
                      {item.isCorrect ? `+${item.marksEarned}` : isSkipped ? '0' : `${item.marksEarned}`} marks
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-800 mb-3">{q.text}</p>
                  {q.type === 'mcq' && q.options && (
                    <div className="space-y-1.5">
                      {q.options.map((opt, oi) => {
                        const isCorrectOpt = oi === q.correctAnswer;
                        const isSelected = oi === item.selected;
                        return (
                          <div key={oi} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isCorrectOpt ? 'bg-green-100 text-green-800 font-semibold' : isSelected && !isCorrectOpt ? 'bg-red-100 text-red-800' : 'text-gray-600'}`}>
                            <span className="font-bold w-5">{String.fromCharCode(65 + oi)}.</span>
                            <span className="flex-1">{opt}</span>
                            {isCorrectOpt && <CheckCircle size={14} className="text-green-600 flex-shrink-0"/>}
                            {isSelected && !isCorrectOpt && <XCircle size={14} className="text-red-500 flex-shrink-0"/>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {q.explanation && (
                    <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-800">
                      <span className="font-bold">Explanation: </span>{q.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

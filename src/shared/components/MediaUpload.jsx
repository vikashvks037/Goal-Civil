'use client';
import { useRef, useState } from 'react';
import { Upload, X, FileVideo, FileText, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react';

const TYPE_CONFIG = {
  video: {
    accept: 'video/*',
    endpoint: '/api/upload/video',
    icon: FileVideo,
    label: 'Video Upload karo',
    hint: 'MP4, WebM, MOV (max 500MB)',
    color: 'blue',
  },
  pdf: {
    accept: 'application/pdf',
    endpoint: '/api/upload/pdf',
    icon: FileText,
    label: 'PDF Upload karo',
    hint: 'PDF only (max 50MB)',
    color: 'red',
  },
  image: {
    accept: 'image/*',
    endpoint: '/api/upload/image',
    icon: ImageIcon,
    label: 'Image Upload karo',
    hint: 'JPG, PNG, WebP (max 10MB)',
    color: 'green',
  },
  pic: {
    accept: 'image/*',
    endpoint: '/api/upload/pic',
    icon: ImageIcon,
    label: 'Photo Upload karo',
    hint: 'JPG, PNG (max 5MB)',
    color: 'purple',
  },
};

const COLOR_CLASSES = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-300',   icon: 'text-blue-500',   btn: 'bg-blue-600 hover:bg-blue-700',   progress: 'bg-blue-500' },
  red:    { bg: 'bg-red-50',    border: 'border-red-300',    icon: 'text-red-500',    btn: 'bg-red-600 hover:bg-red-700',     progress: 'bg-red-500' },
  green:  { bg: 'bg-green-50',  border: 'border-green-300',  icon: 'text-green-500',  btn: 'bg-green-600 hover:bg-green-700', progress: 'bg-green-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-300', icon: 'text-purple-500', btn: 'bg-purple-600 hover:bg-purple-700', progress: 'bg-purple-500' },
};

/**
 * MediaUpload — reusable file upload component backed by Supabase Storage
 *
 * Props:
 *   type        - 'video' | 'pdf' | 'image' | 'pic'
 *   value       - current URL string (to show existing file)
 *   onChange    - called with new URL after successful upload
 *   className   - optional extra className
 *   compact     - smaller display mode (default false)
 */
export function MediaUpload({ type = 'image', value, onChange, className = '', compact = false }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.image;
  const colors = COLOR_CLASSES[config.color];
  const Icon = config.icon;

  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setDone(false);
    setUploading(true);
    setProgress(10);

    try {
      const fd = new FormData();
      fd.append('file', file);

      // Simulate progress while uploading
      const ticker = setInterval(() => setProgress(p => Math.min(p + 10, 85)), 400);

      const res = await fetch(config.endpoint, { method: 'POST', body: fd });
      clearInterval(ticker);

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || 'Upload fail ho gaya. Dobara try karo.');
        setUploading(false);
        setProgress(0);
        return;
      }

      setProgress(100);
      setDone(true);
      onChange?.(data.url);

      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        setDone(false);
      }, 1500);
    } catch {
      setError('Network error. Internet check karo.');
      setUploading(false);
      setProgress(0);
    }

    // Reset input so same file can be picked again
    e.target.value = '';
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange?.('');
    setError('');
  };

  // Compact mode: just a small button inline
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors ${colors.btn} disabled:opacity-50`}
        >
          {uploading
            ? <Loader2 size={12} className="animate-spin" />
            : <Upload size={12} />}
          {uploading ? `${progress}%` : 'Upload'}
        </button>

        {value && (
          <span className="text-xs text-gray-500 truncate max-w-[140px]">
            ✓ Uploaded
          </span>
        )}

        {error && <span className="text-xs text-red-500">{error}</span>}

        <input
          ref={fileRef}
          type="file"
          accept={config.accept}
          onChange={handleFile}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Drop zone / upload area */}
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all
          ${colors.bg} ${colors.border}
          ${uploading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.99]'}`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm`}>
            {uploading
              ? <Loader2 size={20} className={`${colors.icon} animate-spin`} />
              : done
                ? <CheckCircle size={20} className="text-green-500" />
                : <Icon size={20} className={colors.icon} />
            }
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800">
              {uploading ? `Uploading… ${progress}%` : done ? 'Upload ho gaya!' : config.label}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{config.hint}</p>
          </div>

          {!uploading && (
            <div className={`px-3 py-1.5 text-xs font-bold text-white rounded-lg ${colors.btn} flex-shrink-0`}>
              Browse
            </div>
          )}
        </div>

        {/* Progress bar */}
        {uploading && (
          <div className="mt-3 h-1.5 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.progress} rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 font-medium px-1">{error}</p>
      )}

      {/* Preview / current value */}
      {value && !uploading && (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
          {type === 'image' || type === 'pic' ? (
            <img src={value} alt="preview" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200" />
          ) : (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
              <Icon size={16} className={colors.icon} />
            </div>
          )}
          <span className="text-xs text-gray-600 flex-1 truncate">{value.split('/').pop()}</span>
          <button
            type="button"
            onClick={clear}
            className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={config.accept}
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}

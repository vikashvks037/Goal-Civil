import '../../styles/globals.css';

export const metadata = { title: 'Goal Civil — Auth' };

export default function AuthLayout({ children }) {
  return (
    <div className="auth-wrapper">
      {/* Background blobs */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'rgba(37,99,235,0.06)', filter: 'blur(80px)', transform: 'translate(-30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'rgba(139,92,246,0.06)', filter: 'blur(80px)', transform: 'translate(30%, 30%)' }}
      />
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}

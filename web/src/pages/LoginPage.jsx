export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #4361ee 0%, #7209b7 50%, #f72585 100%)' }}>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />
        <div className="absolute -bottom-[30%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 drop-shadow-xl">📅</div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Shift Manager
          </h1>
          <p className="text-white/60 mt-2 text-sm font-medium">
            จัดกะ • สลับกะ • ลางาน • ดูสถิติ
          </p>
        </div>

        {/* Login Card */}
        <div className="backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <a
            href="/auth/google"
            className="flex items-center justify-center gap-3 w-full px-6 py-4
                     bg-white rounded-2xl hover:shadow-xl hover:-translate-y-0.5
                     transition-all duration-200 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
              เข้าสู่ระบบด้วย Google
            </span>
          </a>

          <p className="text-center text-[11px] text-white/40 mt-5 font-medium">
            ใช้อีเมลที่ลงทะเบียนในระบบเท่านั้น
          </p>
        </div>

        <p className="text-center text-[11px] text-white/30 mt-8 font-medium">
          Shift Manager v2.0 — React Edition
        </p>
      </div>
    </div>
  );
}

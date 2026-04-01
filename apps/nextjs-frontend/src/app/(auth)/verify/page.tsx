import VerifyOtpForm from '@/components/features/auth/VerifyOtpForm';

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      {/* Trang trí nền bằng các đốm màu Blur nhẹ (Branding) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-80 h-80 bg-emerald-100 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-blue-100 rounded-full blur-[100px]"></div>
      </div>

      {/* Card chứa form OTP */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-soft">
        <VerifyOtpForm />
      </div>
    </div>
  );
}
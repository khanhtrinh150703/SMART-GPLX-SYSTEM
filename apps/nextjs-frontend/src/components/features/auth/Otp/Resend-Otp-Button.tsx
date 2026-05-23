import React from 'react';

interface ResendOtpButtonProps {
  onClick: () => void;
  isActive: boolean;
  seconds: number;
  isLoading?: boolean;
}

export const ResendOtpButton = ({ 
  onClick, 
  isActive, 
  seconds, 
  isLoading = false 
}: ResendOtpButtonProps) => {
  return (
    <div className="text-center w-full pt-2">
      <button
        type="button"
        onClick={onClick}
        disabled={isActive || isLoading}
        className={`inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold tracking-wide uppercase py-2.5 px-5 rounded-xl transition-all duration-200 min-w-[200px]
          ${
            isActive || isLoading
              ? "text-slate-400 bg-transparent cursor-not-allowed"
              : "text-emerald-600 bg-transparent hover:bg-emerald-50/60 hover:text-emerald-700 active:scale-[0.97]"
          }`}
      >
        {isLoading ? (
          <>
            {/* Spinner quay màu xám đen tiệp với màu chữ */}
            <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-slate-500 normal-case font-semibold">Đang gửi lại...</span>
          </>
        ) : isActive ? (
          <span className="flex items-center gap-1.5 tabular-nums normal-case font-medium text-slate-400">
            Gửi lại mã sau <span className="text-emerald-600 font-extrabold">{seconds}s</span>
          </span>
        ) : (
          "Gửi lại mã xác nhận"
        )}
      </button>
    </div>
  );
};
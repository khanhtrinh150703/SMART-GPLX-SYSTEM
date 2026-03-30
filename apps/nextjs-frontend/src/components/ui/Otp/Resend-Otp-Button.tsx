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
    <div className="text-center">
      <button
        type="button"
        onClick={onClick}
        disabled={isActive || isLoading}
        className={`text-sm font-semibold py-2 px-4 rounded-lg transition-all ${
          isActive
            ? "text-slate-300 cursor-not-allowed bg-slate-50"
            : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95"
        }`}
      >
        {isActive
          ? `Gửi lại mã sau (${seconds}s)`
          : "Gửi lại mã xác nhận"}
      </button>
    </div>
  );
};
import React from 'react';

interface OtpHeaderProps {
  email: string;
  title?: string;
}

export const OtpHeader = ({ email, title = "Xác thực mã OTP" }: OtpHeaderProps) => {
  return (
    <div className="text-center mb-8 pt-4">
      {/* Tiêu đề chính (Main Title) */}
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
        {title}
      </h1>
      
      {/* Mô tả phụ (Sub-description) */}
      <p className="text-slate-500 text-sm mt-2 leading-relaxed">
        Mã xác nhận gồm 6 chữ số đã được gửi đến địa chỉ email: 
        <br />
        <span className="font-semibold text-slate-800 underline decoration-emerald-200 decoration-2 underline-offset-4">
          {email}
        </span>
      </p>
    </div>
  );
};
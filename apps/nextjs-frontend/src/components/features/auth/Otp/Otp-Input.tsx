'use client';
import { useRef } from "react";

interface OtpInputProps {
  value: string[];
  onChange: (newOtp: string[]) => void;
  disabled?: boolean;
}

export const OtpInput = ({ value, onChange, disabled }: OtpInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...value];
    newOtp[index] = val.substring(val.length - 1);
    onChange(newOtp);
    if (val && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="grid grid-cols-6 gap-3 sm:gap-4 w-full max-w-md mx-auto">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`
            w-full aspect-square flex items-center justify-center text-center
            /* CHỮ: text-gray-900 (Đen đậm), font-bold để nổi bật */
            text-2xl font-bold text-gray-900
            
            /* BO GÓC: Nâng lên rounded-xl cho đồng bộ */
            rounded-xl border-2 transition-all duration-200 outline-none
            
            ${digit 
              ? "border-emerald-500 bg-white shadow-sm" 
              : "border-gray-300 bg-gray-50/50"
            }
            
            ${disabled 
              ? "opacity-50 bg-gray-100 cursor-not-allowed" 
              : "focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
            }
          `}
        />
      ))}
    </div>
  );
};
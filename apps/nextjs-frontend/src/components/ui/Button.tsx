// components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export default function Button({ text, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      // KHÔNG CÒN HARDCODE MÀU XANH HAY BO GÓC NỮA
      // Dùng bg-primary, hover:bg-primary-hover, rounded-theme
      className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 px-4 rounded-theme font-semibold transition-colors duration-200 shadow-sm"
    >
      {text}
    </button>
  );
}
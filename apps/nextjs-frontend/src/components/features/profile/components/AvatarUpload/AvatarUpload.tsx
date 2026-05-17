"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/utils"; // cn: Tiện ích gộp class Tailwind
import { useUserStore } from "@/store/user/user.store";

interface AvatarUploadProps {
  value?: string | File; 
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export const AvatarUpload = ({ value, onChange, disabled }: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [preview, setPreview] = useState<string>(""); 
  const user = useUserStore((state) => state.user);

  // Xử lý logic hiển thị ảnh Preview (Side Effect)
  useEffect(() => {
    // Quan trọng: Reset lại trạng thái lỗi mỗi khi giá trị thay đổi
    // (Reset error state whenever value changes)
    setImageError(false);

    if (!value) {
      setPreview("");
      return;
    }

    if (value instanceof File) {
      // Tạo đường dẫn tạm thời cho file cục bộ
      // (Create temporary URL for local file)
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);

      // Dọn dẹp bộ nhớ khi component unmount hoặc value thay đổi
      // (Cleanup memory leak)
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (typeof value === "string") {
      setPreview(value);
    }
  }, [value]);

  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    return parts.length >= 2 
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() 
      : name.substring(0, 2).toUpperCase();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation: Kiểm tra định dạng file cơ bản
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp tin hình ảnh!");
      return;
    }

    try {
      setIsUploading(true);
      // Giả lập delay (Simulate network delay)
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      onChange(file); 
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
      // Giải phóng input để có thể chọn lại cùng 1 file
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative inline-flex flex-col items-center p-4">
      <div className="relative group">
        <div
          className={cn(
            "relative w-32 h-32 md:w-36 md:h-36 rounded-[2.5rem] overflow-hidden",
            "bg-emerald-50 border-4 border-white shadow-soft transition-all duration-500",
            "group-hover:scale-105 group-hover:shadow-emerald-200/60",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {/* Điều kiện hiển thị: Có preview và KHÔNG có lỗi load ảnh 
            (Display condition: Has preview AND no loading error)
          */}
          {preview && !imageError ? (
            <Image
              src={preview}
              alt="Avatar Preview"
              fill
              priority
              unoptimized 
              className={cn(
                "object-cover transition-all duration-500",
                isUploading ? "blur-sm scale-110" : "group-hover:scale-110"
              )}
              onError={() => {
                console.warn("Failed to load image preview");
                setImageError(true);
              }}
            />
          ) : (
            // Placeholder khi chưa có ảnh hoặc ảnh lỗi (Fallback UI)
            <div className="w-full h-full flex items-center justify-center bg-emerald-100">
              <span className="text-4xl md:text-5xl text-emerald-700 font-black tracking-tighter">
                {getInitials(user?.fullName || "User")}
              </span>
            </div>
          )}

          {/* Loading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-20">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
          )}
        </div>

        {/* Nút điều khiển (Action Buttons) */}
        {!disabled && !isUploading && (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "absolute bottom-2 right-2 bg-white p-2.5 rounded-2xl shadow-xl border border-slate-100",
                "text-slate-500 hover:text-emerald-600 hover:scale-110 active:scale-95 transition-all",
                "z-30 cursor-pointer"
              )}
              title="Thay đổi ảnh (Change photo)"
            >
              <Camera className="w-5 h-5" strokeWidth={2.5} />
            </button>

            {preview && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="absolute top-2 right-2 bg-rose-500 text-white p-2 rounded-xl shadow-lg 
                           hover:bg-rose-600 hover:scale-110 active:scale-90 transition-all z-30"
                title="Xóa ảnh (Remove photo)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center select-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Cập nhật ảnh
        </span>
        <span className="text-[9px] text-slate-300 font-medium uppercase mt-0.5">
          (Update Photo)
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
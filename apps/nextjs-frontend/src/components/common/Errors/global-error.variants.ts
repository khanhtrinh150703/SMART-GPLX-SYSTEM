// src/components/common/Errors/global-error.variants.ts
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Container Variants (Biến thể khung chứa)
 * Kết hợp giữa các phong cách tối giản và các chủ đề (light/dark)
 */
export const containerVariants = cva(
    "w-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700",
    {
        variants: {
            theme: {
                light: "bg-slate-50 text-slate-900",
                dark: "bg-[#022c22] text-white", // Deep Forest theme
                transparent: "bg-transparent",
            },
            layout: {
                default: "min-h-[70vh]",
                full: "min-h-screen",
            },
        },
        defaultVariants: {
            theme: "light",
            layout: "default",
        },
    }
);

/**
 * Icon Box Variants (Biến thể hộp chứa biểu tượng)
 * Hỗ trợ Glassmorphism (hiệu ứng kính mờ), nhiều kích thước và trạng thái lỗi khác nhau
 */
export const iconBoxVariants = cva(
    "relative z-10 flex items-center justify-center backdrop-blur-md border transition-all duration-500",
    {
        variants: {
            // Trong file global-error.variants.ts, cập nhật phần status của iconBoxVariants:
            status: {
                default: "bg-white shadow-soft border-slate-100 text-slate-500",
                forbidden: "bg-amber-50/50 border-amber-200 text-amber-500 shadow-amber-100", // 403
                method: "bg-slate-50/50 border-slate-200 text-slate-500", // 405
                server: "bg-rose-50/50 border-rose-200 text-rose-500 shadow-rose-100", // 500
                network: "bg-emerald-50/50 border-emerald-200 text-emerald-500 shadow-emerald-100", // Network
                neutral: "bg-slate-50/50 border-slate-200 text-slate-400 shadow-sm", // <--- THÊM MỚI: Dùng cho các trường hợp trung tính
            },
            size: {
                md: "w-24 h-24 rounded-[2.5rem] hover:scale-105",
                lg: "w-32 h-32 rounded-3xl hover:scale-105",
                xl: "w-40 h-40 rounded-[3rem] hover:rotate-6", // Dành cho trang 404 đặc biệt
            },
        },
        defaultVariants: {
            status: "default",
            size: "lg",
        },
    }
);

// Export types để sử dụng trong Component
export type ContainerVariantProps = VariantProps<typeof containerVariants>;
export type IconBoxVariantProps = VariantProps<typeof iconBoxVariants>;
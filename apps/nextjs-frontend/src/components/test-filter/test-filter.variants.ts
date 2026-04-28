// src/features/gplx-test/components/test-filter/test-filter.variants.ts
import { cva } from "class-variance-authority";

export const filterVariants = {
  // Container: Bo góc cực lớn, Glassmorphism mượt mà hơn
  container: cva(
    "flex flex-col md:flex-row items-center gap-4 bg-white/70 backdrop-blur-md p-2.5 rounded-[2.5rem] border border-white/50 shadow-soft"
  ),
  
  // Search Group: Bỏ nền Slate đậm, dùng border và shadow nhẹ để tạo chiều sâu
  searchGroup: cva([
    "flex items-center flex-1 h-12 bg-white rounded-[1.75rem] px-4",
    "border border-slate-100 shadow-inner-sm transition-all duration-300",
    "focus-within:border-emerald-500/40 focus-within:shadow-emerald-100/20 focus-within:ring-4 focus-within:ring-emerald-500/5"
  ]),

  // Input: Chỉnh lại font weight để không bị thô
  input: cva(
    "w-full bg-transparent border-none outline-none text-[14px] font-medium text-slate-600 placeholder:text-slate-400 placeholder:font-normal ml-3"
  ),

  // Divider: Thay vạch kẻ cứng bằng khoảng trắng hoặc vạch mờ cực nhẹ
  divider: cva("w-[1px] h-5 bg-slate-200/60 mx-1")
};
import { cva } from "class-variance-authority";

export const footerVariants = {
  container: "bg-white border-t border-slate-200 py-10 relative z-10",
  inner: "max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6",
  
  // Phong cách cho Logo & Copyright
  brandWrapper: "flex items-center gap-3",
  logoBox: "w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg shadow-slate-900/10",
  logoText: "text-emerald-400 font-bold text-sm",
  copyright: "text-slate-500 text-sm font-medium",

  // Phong cách cho danh sách liên kết
  linkGroup: "flex items-center flex-wrap justify-center gap-8",
  linkItem: "flex items-center gap-2 text-slate-500 hover:text-emerald-600 cursor-pointer transition-all duration-300 text-sm font-semibold hover:-translate-y-0.5",
};
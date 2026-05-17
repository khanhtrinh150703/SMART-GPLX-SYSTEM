export interface FooterVariants {
  container: string;
  inner: string;
  brandWrapper: string;
  logoBox: string;
  logoText: string;
  copyright: string;
  linkGroup: string;
  linkItem: string;
}
export const footerVariants = {
  container: "bg-white border-t border-slate-200/80 py-8 relative z-10",
  inner:
    "max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6",
  brandWrapper: "flex items-center gap-3",

  // Hộp chứa logo bo góc lớn (Large rounded logo container box)
  logoBox:
    "w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center shadow-soft",

  logoText:
    "text-emerald-300 font-black text-sm tracking-wide antialiased select-none",

  copyright: "text-slate-500 text-sm font-medium",
  linkGroup: "flex items-center flex-wrap justify-center gap-6 sm:gap-8",
  linkItem:
    "flex items-center gap-2 text-slate-500 hover:text-emerald-500 cursor-pointer transition-all duration-300 text-sm font-semibold hover:-translate-y-0.5 active:scale-[0.98]",
};


// Định nghĩa các chuỗi Tailwind (Style Isolation)
export const heroVariants = {
  container: "text-center pt-20 max-w-4xl mx-auto px-6",
  gradient: "text-transparent bg-clip-text bg-[linear-gradient(to_right,#059669,#14b8a6,#059669)] bg-[length:200%_auto]",
  badge: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-semibold mb-6 transition-all",
  title: "text-5xl md:text-[4rem] font-extrabold tracking-tight text-slate-800 leading-[1.15]",
  gradientText: "text-transparent bg-clip-text bg-[linear-gradient(to_right,#059669,#14b8a6,#059669)] bg-[length:200%_auto]",
  // Subtitle/Description (Phụ đề)
  description: "text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto",
  
  // Search Bar Elements (Thành phần thanh tìm kiếm)
  searchWrapper: "relative max-w-xl mx-auto mt-12 group transition-all",
  
  searchInput: "w-full pl-8 pr-16 py-5 bg-white/80 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/50 outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition-all text-base placeholder:text-slate-400 font-medium",
  
  searchButton: "absolute right-2 top-2 bottom-2 aspect-square bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all hover:rotate-12",
};

// Định nghĩa logic hoạt ảnh (Animation Logic)
export const heroAnimations = {
  badge: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { delay: 0.2, duration: 0.5 }
  },
  gradient: {
    animate: { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] },
    transition: { duration: 5, repeat: Infinity, ease: "linear" } as const
  }
};
// src/features/admin-users/components/UserToolbar.tsx
import { Search, ChevronDown, Sparkles, Loader2 } from "lucide-react";

export const UserToolbar = ({ isLoading }: { isLoading: boolean }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="pl-11 pr-4 py-2.5 rounded-full border border-slate-200 outline-none focus:border-emerald-500 w-64 transition-all"
        />
      </div>
      <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all font-medium text-sm">
        Bộ lọc: Tất cả <ChevronDown size={16} />
      </button>
    </div>
    <button disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft transition-all active:scale-[0.98] font-medium text-sm disabled:opacity-70">
      {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
      Thêm học viên mới
    </button>
  </div>
);
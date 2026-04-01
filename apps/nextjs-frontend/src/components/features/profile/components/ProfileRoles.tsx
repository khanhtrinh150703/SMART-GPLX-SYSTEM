'use client';

interface ProfileRolesProps {
  roles: string[];
}

export default function ProfileRoles({ roles }: ProfileRolesProps) {
  return (
    <div className="space-y-4">
      <label className="text-sm font-bold text-slate-700 ml-1">Quyền hạn tài khoản (System Roles)</label>
      <div className="flex flex-wrap gap-3 p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
        {roles.map((role, idx) => (
          <span 
            key={idx} 
            className="px-4 py-2 bg-white text-emerald-700 text-xs font-black rounded-xl border border-emerald-100 shadow-sm flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            {role.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}
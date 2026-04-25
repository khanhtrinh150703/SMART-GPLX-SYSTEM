import React from "react";
import { IImportError } from "../types/import.types";

/**
 * @description Properties definition for the ErrorReport component
 * (Định nghĩa thuộc tính cho thành phần Báo cáo Lỗi)
 */
interface ErrorReportProps {
  errors: IImportError[];
}

/**
 * @description Renders a scrollable and stylized list of import errors from the Database inside the Alert.
 * (Hiển thị danh sách lỗi nhập liệu có thể cuộn và được định dạng từ Cơ sở dữ liệu bên trong Thông báo.)
 */
export const ErrorReport: React.FC<ErrorReportProps> = ({ errors }) => {
  // Early return (Thoát sớm) nếu mảng rỗng để tránh render khối DOM thừa
  if (!errors || errors.length === 0) return null;

  return (
    <div className="mt-4 w-full border-t border-rose-200/60 pt-4">
      {/* Tiêu đề danh sách lỗi (Error List Header) */}
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-rose-800">
        Chi tiết lỗi từ Database (DB Error Details):
      </h4>
      
      {/* Danh sách cuộn (Scrollable List) */}
      <ul className="custom-scrollbar max-h-[250px] space-y-2 overflow-y-auto pr-2">
        {errors.map((err, index) => (
          <li 
            // Composite Key (Khóa kết hợp) để đảm bảo tính duy nhất và an toàn cho React render
            key={`error-${err.row}-${index}`} 
            className="group flex items-start gap-3 rounded-xl border border-rose-100 bg-white/60 p-3 shadow-sm transition-all hover:border-rose-300 hover:bg-white hover:shadow-md"
          >
            {/* Chỉ báo số dòng (Row Indicator Badge) */}
            <div className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-full border border-rose-200 bg-rose-100 text-rose-700 transition-colors group-hover:bg-rose-200">
              <span className="text-[10px] uppercase leading-none opacity-80">Dòng</span>
              <span className="text-sm font-bold leading-none">{err.row}</span>
            </div>

            {/* Chi tiết nội dung lỗi (Error Content Details) */}
            <div className="flex-grow">
              <p className="text-xs font-bold uppercase tracking-wide text-rose-500">
                Cột (Column): {err.column || "N/A"}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                {err.message}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
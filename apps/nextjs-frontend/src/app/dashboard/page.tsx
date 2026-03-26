export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card Thống kê 1 */}
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-50 flex flex-col">
        <span className="text-gray-500 text-sm font-medium">Tổng số học viên</span>
        <span className="text-3xl font-bold text-gray-900 mt-2">1,248</span>
      </div>
      
      {/* Card Thống kê 2 */}
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-50 flex flex-col">
        <span className="text-gray-500 text-sm font-medium">Đề thi đã duyệt</span>
        <span className="text-3xl font-bold text-emerald-600 mt-2">86</span>
      </div>

      {/* Card Thống kê 3 */}
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-50 flex flex-col">
        <span className="text-gray-500 text-sm font-medium">Cảnh báo hệ thống</span>
        <span className="text-3xl font-bold text-amber-500 mt-2">2</span>
      </div>
    </div>
  );
}
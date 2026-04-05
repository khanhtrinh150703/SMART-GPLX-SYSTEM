import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";

/**
 * DashboardLayout - Bố cục chính cho trang quản trị (Dashboard)
 * @param {Object} props - Thuộc tính truyền vào component
 * @param {React.ReactNode} props.children - Các component trang con
 */
/**
 * DashboardLayout - Bố cục khu vực quản trị
 * Khóa khung hình bằng h-screen để tạo vùng cuộn riêng cho thẻ <main>.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // h-screen và overflow-hidden: Khóa chặt khung nhìn trình duyệt
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col min-h-0 min-w-0">
        <Header />
        {/* flex-1 và overflow-y-auto: Chỉ cho phép vùng này được cuộn */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}

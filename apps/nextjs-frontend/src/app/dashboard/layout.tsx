export default function DashboardLayout({
  children, // 'children' (các thành phần con) ở đây chính là nội dung của file page.tsx
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Thanh menu bên trái (Sidebar) */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6 text-blue-600">Hệ thống Quản trị</h2>
        <ul>
          <li className="mb-3 hover:text-blue-500 cursor-pointer font-medium">Tổng quan</li>
          <li className="mb-3 hover:text-blue-500 cursor-pointer font-medium">Quản lý Dữ liệu</li>
          <li className="mb-3 hover:text-blue-500 cursor-pointer font-medium">Cài đặt</li>
        </ul>
      </aside>

      {/* Khu vực nội dung chính */}
      <main className="flex-1 p-8">
        {children} 
      </main>
    </div>
  );
}
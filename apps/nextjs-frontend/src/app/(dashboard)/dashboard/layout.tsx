import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/common/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Thanh Menu bên trái (Sidebar) */}
      <Sidebar />

      {/* Cột Nội dung bên phải (Main Content Column) */}
      <div className="flex-1 flex flex-col relative">
        {/* Thanh Tiêu đề trên cùng (Header) */}
        <Header />

        {/* Vùng chứa nội dung chính (High Whitespace, Scrollable) */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Nội dung của các file page.tsx sẽ được Render (Kết xuất) vào đây */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
import { siteConfig } from '@/src/config/site';

interface AuthLayoutProps {
  children: React.ReactNode; // Phần form sẽ được nhúng vào đây
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white font-sans text-gray-800">
      {/* CỘT TRÁI: Dùng chung cho mọi trang xác thực */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-600 to-teal-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-white max-w-lg">
          <h2 className="text-4xl font-extrabold mb-6 leading-tight">
            {siteConfig.auth.slogan}
          </h2>
          <p className="text-emerald-100 text-lg mb-8 opacity-90">
            {siteConfig.auth.description}
          </p>
          <div className="w-full h-64 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
            <span className="text-emerald-50 opacity-70 italic">[Hình ảnh AI System]</span>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: Nơi chứa Form động */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-500 text-sm">{subtitle}</p>
          </div>
          
          {/* Form cụ thể (Login/Register) sẽ được render ở đây */}
          {children} 
          
        </div>
      </div>
    </div>
  );
}
import AuthLayout from '@/src/components/layouts/AuthLayout';
import { siteConfig } from '@/src/constants/config/site';
import LoginForm from '@/src/components/features/auth/LoginForm'; // Import Component chứa logic

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Đăng nhập" 
      subtitle={`Tiếp tục hành trình tại ${siteConfig.appName}`}
    >
      {/* Gọi Component Form Đăng nhập ra đây */}
      <LoginForm />
    </AuthLayout>
  );
}
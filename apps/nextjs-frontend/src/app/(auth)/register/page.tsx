import AuthLayout from '@/src/components/layouts/AuthLayout';
import { siteConfig } from '@/src/constants/config/site';
import RegisterForm from '@/src/components/features/auth/RegisterForm'; // Gọi Component vừa tạo

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Tạo tài khoản"
      subtitle={`Chào mừng bạn đến với ${siteConfig.appName}`}
    >
      <RegisterForm />
    </AuthLayout>
  );
}
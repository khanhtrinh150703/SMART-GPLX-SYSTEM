'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import bộ điều hướng
import axios from 'axios'; // Import để bắt lỗi

import AuthLayout from '@/src/components/layouts/AuthLayout';
import { GoogleButton, Divider } from '@/src/components/ui/SocialLogin';
import Input from '@/src/components/ui/Input';
import Button from '@/src/components/ui/Button';
import { siteConfig } from '@/src/config/site';
import { authApi } from '@/src/api/auth/auth.api'; // Import hàm gọi API

export default function LoginPage() {
  const router = useRouter();

  // 1. State quản lý form đăng nhập
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // State quản lý UI khi gọi API
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 2. Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Xử lý submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate nhanh ở Frontend
    if (!formData.username || !formData.password) {
      setErrorMsg('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API Đăng nhập
      const response = await authApi.login({
        username: formData.username.trim(),
        password: formData.password,
      });

      // Lưu Token (Vé thông hành) vào localStorage
      // Lưu ý: Sửa lại 'response.token' cho đúng với cấu trúc JSON Backend của bạn trả về
      const token = response.data?.token;
      if (token) {
        localStorage.setItem('accessToken', token);
      }

      // Điều hướng vào trang chủ hệ thống (Dashboard)
      router.push('/dashboard');

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Lấy lời nhắn từ Backend (Ví dụ: "Sai mật khẩu", "Tài khoản chưa kích hoạt")
        const backendMessage = error.response?.data?.message;
        setErrorMsg(backendMessage || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
      } else {
        setErrorMsg('Đã có sự cố kết nối đến máy chủ.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Đăng nhập" 
      subtitle={`Tiếp tục hành trình tại ${siteConfig.appName}`}
    >
      <div className="space-y-3">
        <GoogleButton text="Đăng nhập với Google" />
      </div>

      <Divider text="Hoặc dùng tài khoản hệ thống" />

      {/* Khung hiển thị lỗi */}
      {errorMsg && (
        <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input 
          label="Tên đăng nhập" 
          name="username" 
          type="text"
          value={formData.username} 
          onChange={handleChange} 
          placeholder="Nhập tên đăng nhập của bạn"
          disabled={isLoading}
          required 
        />
        
        <div>
          <Input 
            label="Mật khẩu" 
            name="password" 
            type="password"
            value={formData.password} 
            onChange={handleChange} 
            placeholder="••••••••"
            disabled={isLoading}
            required 
          />
          <div className="flex justify-end mt-2">
            <Link href="/auth/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <Button 
            text={isLoading ? 'Đang xác thực...' : 'Đăng nhập'} 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-3 font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed" 
          />
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-gray-600">
        Chưa có tài khoản?{' '}
        <Link href="/auth/register" className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors">
          Đăng ký ngay
        </Link>
      </div>
    </AuthLayout>
  );
}
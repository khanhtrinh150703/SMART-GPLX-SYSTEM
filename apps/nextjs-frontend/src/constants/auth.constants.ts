// constants/auth.constants.ts

// Định nghĩa kiểu dữ liệu cho cấu hình của một ô Input
export interface FormFieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
}

// Cấu hình (Schema) cho Form Đăng ký
export const REGISTER_FORM_FIELDS: FormFieldConfig[] = [
  { name: 'username', label: 'Tên đăng nhập', type: 'text', placeholder: 'VD: trinh_cau_vang', required: true },
  { name: 'email', label: 'Địa chỉ Email', type: 'email', placeholder: 'VD: hocvien@gmail.com', required: true },
  { name: 'password', label: 'Mật khẩu', type: 'password', placeholder: 'Ít nhất 8 ký tự', required: true },
  { name: 'confirmPassword', label: 'Xác nhận mật khẩu', type: 'password', placeholder: 'Nhập lại mật khẩu', required: true },
  { name: 'fullName', label: 'Họ và tên', type: 'text', placeholder: 'VD: Nguyễn Văn A', required: false },
];
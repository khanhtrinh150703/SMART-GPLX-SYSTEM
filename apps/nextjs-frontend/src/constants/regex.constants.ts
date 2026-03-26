// src/constants/regex.constants.ts

/**
 * Tập hợp các Biểu thức chính quy (Regular Expressions) dùng chung cho toàn hệ thống.
 */
export const REGEX = {
  // Kiểm tra email hợp lệ (Valid Email Format)
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // Mật khẩu: Ít nhất 8 ký tự, có chữ hoa, chữ thường, số VÀ ký tự đặc biệt (Strong Password)
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,

  // Số điện thoại Việt Nam hợp lệ (Vietnamese Phone Number)
  PHONE_VN: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,

  // Chỉ cho phép nhập số (Numbers Only)
  ONLY_NUMBERS: /^\d+$/,
};  
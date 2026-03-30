import { FieldValues, UseFormRegister } from "react-hook-form";

// Props cho các thành phần nhập liệu
export interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  name: string;
  // Thay <any> bằng <FieldValues>
  register: UseFormRegister<FieldValues>;
  error?: {
    message?: string;
  };
}
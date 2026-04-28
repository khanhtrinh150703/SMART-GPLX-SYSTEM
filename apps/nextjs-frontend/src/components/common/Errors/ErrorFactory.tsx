import React from 'react';
import { 
  ForbiddenView, 
  ServerErrorView, 
  NetworkErrorView, 
  MethodNotAllowedView,
  NotFoundView 
} from './index';

/**
 * Error Factory Pattern (Mô hình xưởng sản xuất lỗi)
 * Mục tiêu: Trả về Component hiển thị đúng dựa trên Status Code
 */
const errorMap: Record<string, React.ComponentType> = {
  '403': ForbiddenView,          // Bị cấm truy cập
  '404': NotFoundView,           // Không tìm thấy
  '405': MethodNotAllowedView,    // Sai phương thức
  '500': ServerErrorView,        // Lỗi hệ thống
  'network': NetworkErrorView,    // Mất kết nối
};

interface ErrorFactoryProps {
  code: string;
}

export const ErrorFactory = ({ code }: ErrorFactoryProps) => {
  // Lấy Component tương ứng từ Map, nếu không có thì mặc định hiện 500
  const TargetView = errorMap[code] || ServerErrorView;

  return <TargetView />;
};
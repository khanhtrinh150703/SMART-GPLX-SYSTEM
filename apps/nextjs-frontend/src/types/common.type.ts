// src/types/common.type.ts

export interface StandardResponse<T> {
  success: boolean;
  code: string;       
  statusCode: number; 
  message: string;
  data?: T; // <T> là phần lõi dữ liệu sẽ thay đổi tùy theo từng API           
}
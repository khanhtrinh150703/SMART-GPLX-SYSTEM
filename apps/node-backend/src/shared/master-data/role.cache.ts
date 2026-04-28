/**
 * @description Cấu trúc dữ liệu Vai trò (Role) trong Cache
 */
export interface ICachedRole {
  id: string;
  name: string;
  description: string;
  permissions: string[]; 
}
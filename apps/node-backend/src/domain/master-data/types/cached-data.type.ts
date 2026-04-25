/**
 * @description Cấu trúc dữ liệu Vai trò (Role) trong Cache
 */
export interface ICachedRole {
  id: string;
  name: string;
  description: string;
  permissions: string[]; 
}

/**
 * @description Cấu trúc dữ liệu Chương học (Chapter) trong Cache
 */
export interface ICachedChapter {
  id: string;
  name: string;
}

/**
 * @description Cấu trúc dữ liệu Hạng bằng (License Category) trong Cache
 */
export interface ICachedCategory {
  id: string;
  name: string;
}
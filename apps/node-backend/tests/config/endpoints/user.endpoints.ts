import { API_BASE } from '../api-base.config';

/** @description Endpoints quản lý thông tin người dùng */
export const USER_ENDPOINTS = {
  ME_PROFILE: `${API_BASE.USER}/me/profile`,
  ME_PASSWORD: `${API_BASE.USER}/me/password`,
  USER_STATUS: (userId: string): string => `${API_BASE.USER}/${userId}/status`,
  USER_DELETE: (userId: string): string => `${API_BASE.USER}/${userId}`,
  USER_RESTORE: (userId: string): string => `${API_BASE.USER}/${userId}/restore`,
  USERS_LIST: API_BASE.USER,
  ADMIN_CREATE_USER: `${API_BASE.USER}/admin`,
  ADMIN_UPDATE_USER: (userId: string): string => `${API_BASE.USER}/${userId}/admin`,
  ADMIN_UPDATE_PROFILE: (userId: string): string => `${API_BASE.USER}/admin/${userId}`
} as const;
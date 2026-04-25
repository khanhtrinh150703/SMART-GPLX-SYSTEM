import { API_BASE } from '../api-base.config';

export const CHAPTER_ENDPOINTS = {
  BASE: API_BASE.CHAPTER,
  CREATE: API_BASE.CHAPTER,
  FETCH_ALL: API_BASE.CHAPTER,
  SELECTION: `${API_BASE.CHAPTER}/selection`,
  UPDATE: (id: string) => `${API_BASE.CHAPTER}/${id}`,
  DELETE: (id: string) => `${API_BASE.CHAPTER}/${id}`,
  RESTORE: (id: string) => `${API_BASE.CHAPTER}/${id}/restore`,
} as const;

import { API_BASE } from '../api-base.config';

export const LICENSE_ENDPOINTS = {
  BASE: API_BASE.LICENSE,
  CREATE: API_BASE.LICENSE,
  FETCH_ALL: API_BASE.LICENSE,
  SELECTION: `${API_BASE.LICENSE}/selection`,
  UPDATE: (id: string) => `${API_BASE.LICENSE}/${id}`,
  DELETE: (id: string) => `${API_BASE.LICENSE}/${id}`,
  RESTORE: (id: string) => `${API_BASE.LICENSE}/${id}/restore`,
} as const;
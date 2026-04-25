/**
 * @description Trạng thái của một phiên Import (Dịch: Import Session Status)
 */
export const IMPORT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  QUEUED: 'QUEUED',
} as const;

export type ImportStatus = typeof IMPORT_STATUS[keyof typeof IMPORT_STATUS];
import { ErrorCode } from './error-codes';
import { VietnameseMessages } from './messages/vi';

export interface IErrorDetail {
  httpStatus: number;
  message: string;
}

export const ErrorCatalog: Record<ErrorCode, IErrorDetail> = {
  // --- GENERAL & SYSTEM ---
  /** Successful operation */
  [ErrorCode.SUCCESS]: { 
    httpStatus: 200, 
    message: VietnameseMessages[ErrorCode.SUCCESS] 
  },
  /** Critical server-side failure */
  [ErrorCode.INTERNAL_SERVER_ERROR]: { 
    httpStatus: 500, 
    message: VietnameseMessages[ErrorCode.INTERNAL_SERVER_ERROR] 
  },
  /** General internal processing error */
  [ErrorCode.INTERNAL_ERROR]: { 
    httpStatus: 500, 
    message: VietnameseMessages[ErrorCode.INTERNAL_ERROR] 
  },

  // --- AUTHENTICATION & SECURITY ---
  /** Identity verification failed or missing */
  [ErrorCode.UNAUTHORIZED]: { 
    httpStatus: 401, 
    message: VietnameseMessages[ErrorCode.UNAUTHORIZED] 
  },
  /** Incorrect login credentials provided */
  [ErrorCode.INVALID_CREDENTIALS]: { 
    httpStatus: 401, 
    message: VietnameseMessages[ErrorCode.INVALID_CREDENTIALS] 
  },
  /** Auth token has expired */
  [ErrorCode.SESSION_EXPIRED]: { 
    httpStatus: 401, 
    message: VietnameseMessages[ErrorCode.SESSION_EXPIRED] 
  },

  // --- USER DOMAIN ---
  /** Resource not found in database */
  [ErrorCode.USER_NOT_FOUND]: { 
    httpStatus: 404, 
    message: VietnameseMessages[ErrorCode.USER_NOT_FOUND] 
  },
  /** Resource conflict due to existing email */
  [ErrorCode.EMAIL_ALREADY_EXISTS]: { 
    httpStatus: 409, 
    message: VietnameseMessages[ErrorCode.EMAIL_ALREADY_EXISTS] 
  },
  /** Resource conflict due to existing user */
  [ErrorCode.USER_ALREADY_EXISTS]: { 
    httpStatus: 409, 
    message: VietnameseMessages[ErrorCode.USER_ALREADY_EXISTS] 
  },

  // --- REQUEST & VALIDATION ---
  /** Generic client-side request error */
  [ErrorCode.BAD_REQUEST]: { 
    httpStatus: 400, 
    message: VietnameseMessages[ErrorCode.BAD_REQUEST] 
  },
  /** Input data fails business rules/validation */
  [ErrorCode.VALIDATION_ERROR]: { 
    httpStatus: 400, 
    message: VietnameseMessages[ErrorCode.VALIDATION_ERROR] 
  }
};
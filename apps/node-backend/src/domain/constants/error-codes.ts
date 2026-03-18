export enum ErrorCode {
    // --- GENERAL & SYSTEM (200, 500) ---
    /** Request completed successfully */
    SUCCESS = 'SUCCESS',
    /** A generic internal server error occurred */
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    /** Unexpected processing error */
    INTERNAL_ERROR = 'INTERNAL_ERROR',

    // --- AUTHENTICATION & SECURITY (401, 403) ---
    /** Identity could not be verified */
    UNAUTHORIZED = 'UNAUTHORIZED',
    /** Invalid login details provided */
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    /** Login session has expired */
    SESSION_EXPIRED = 'SESSION_EXPIRED',

    // --- USER DOMAIN (404, 409) ---
    /** User does not exist in the system */
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    /** Email is already taken by another user */
    EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
    /** User account already exists */
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',

    // --- REQUEST & VALIDATION (400) ---
    /** The request format is incorrect */
    BAD_REQUEST = 'BAD_REQUEST',
    /** Submitted data failed validation checks */
    VALIDATION_ERROR = 'VALIDATION_ERROR'
}
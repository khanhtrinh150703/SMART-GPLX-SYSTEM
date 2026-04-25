import { Response } from 'express';
import { StandardResponse } from '../types/response.type';
import { ErrorCode, ErrorCodeType, ErrorStatus } from '@/shared/errors';
import { Message } from '../errors/messages/success-messages-vn';

export const Result = {

    send: <T>(
        res: Response,
        statusCode: number,
        code: string,
        message: string,
        data?: T
    ) => {
        const response: StandardResponse<T> = {
            success: statusCode >= 200 && statusCode < 300,
            code,
            statusCode,
            message,
            data
        };
        return res.status(statusCode).json(response);
    },

    ok: <T>(
        res: Response,
        data?: T,
        message: string = Message.SYSTEM.DATA_RETRIEVED,
        code: ErrorCodeType | string = ErrorCode.SYSTEM.SUCCESS
    ) => {
        const status = ErrorStatus[code as keyof typeof ErrorStatus] || 200;

        return Result.send(res, status, code, message, data);
    },

    created: <T>(
        res: Response,
        data: T,
        message: string = Message.SYSTEM.ACTION_SUCCESS,
        code: string = 'CREATED_SUCCESS'
    ) => {
        return Result.send(res, 201, code, message, data);
    }
};
import { ErrorCode } from "../../domain/constants/error-codes";

export interface StandardResponse<T> {
  success: true;
  code: string;
  message: string;
  data: T;
}

export const Result = {
  ok: <T>(data: T, message = ErrorCode.SUCCESS): StandardResponse<T> => ({
    success: true,
    code: ErrorCode.SUCCESS,
    message,
    data
  })
};
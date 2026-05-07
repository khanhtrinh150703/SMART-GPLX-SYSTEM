import { Request } from 'express'; // BẮT BUỘC phải có dòng này
import { TokenPayload } from "@/application/dtos/response/auth/token/token-payload.respone.dto";

/**
 * @description Giao diện Yêu cầu (Request) đã được xác thực.
 * (Interface for an authenticated Request.)
 * Luôn chứa đối tượng TokenPayload để truy cập thông tin người dùng và quyền hạn.
 */
export interface IAuthRequest extends Request {
    /** @property {TokenPayload} user - Đối tượng chứa thông tin định danh và logic của người dùng. */
    user: TokenPayload;
}

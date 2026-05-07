/**
 * @description Giao diện dữ liệu trả về sau khi xác thực thành công (Login/Refresh).
 */
export interface ITokenResponseDTO {
    readonly accessToken: string;
    readonly refreshToken: string;
}

/**
 * @description DTO vận chuyển cặp mã Token. 
 * Chỉ đóng vai trò mang dữ liệu (Data Carrier), không chứa logic nghiệp vụ.
 */
export class TokenResponseDTO implements ITokenResponseDTO {
    public readonly accessToken: string;
    public readonly refreshToken: string;

    constructor(data: ITokenResponseDTO) {
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
    }
}
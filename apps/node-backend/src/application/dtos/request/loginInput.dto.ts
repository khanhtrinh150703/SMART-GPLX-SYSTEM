import { REGEX } from "@/domain/constants/regex";

export class LoginInputDTO {
    readonly username!: string;
    // readonly email!: string;
    readonly password!: string;
    // readonly confirmPassword!: string;


    constructor(data: Partial<LoginInputDTO>) {
        Object.assign(this, data);
    }

    /**
     * Kiểm tra tính hợp lệ của mật khẩu
     */
    public isPassword(): boolean {
        return (
            this.validatePasswordComplexity(this.password)
        );
    }

    /**
     * Logic kiểm tra độ phức tạp mật khẩu
     */
    private validatePasswordComplexity(pass: string): boolean {
        // Regex: Ít nhất 1 chữ cái và 1 chữ số (Sử dụng cụm PASSWORD)
        return REGEX.PASSWORD.COMPLEXITY.test(pass);
    }
}
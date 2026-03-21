import { IUserRepository } from "@/domain/interfaces/IUserRepository";
import { ChangePasswordDTO, ChangeStatusDTO, UpdateProfileDTO } from "../dtos/request/user.dto";
import { AppError, ErrorCode } from "@/shared/errors";
import bcrypt from 'bcrypt';
import { UserStatus } from "@/domain/constants/userStatus";


export class UserService {
    constructor(private userRepo: IUserRepository) { }

    // 1. Sửa thông tin
    async updateProfile(userId: string, dto: UpdateProfileDTO) {
        // Bước 1: Tìm user trong Database
        const existingUser = await this.userRepo.findById(userId);

        // Bước 2: Kiểm tra tồn tại
        if (!existingUser) {
            throw new AppError(ErrorCode.USER.NOT_FOUND); // Bạn nhớ thêm mã lỗi NOT_FOUND vào file ErrorCode nhé
        }

        // Bước 3: Cập nhật dữ liệu trên Entity
        // Lưu ý: Dùng !== undefined để kiểm tra, vì client có thể chỉ gửi lên 1 trường (ví dụ chỉ đổi tên, không đổi ảnh)
        // Nếu client gửi chuỗi rỗng (""), ta vẫn chấp nhận update thành chuỗi rỗng (tùy nghiệp vụ của bạn)
        if (dto.fullName !== undefined && dto.urlPicture !== undefined) {
            existingUser.updateProfile(dto.fullName, dto.urlPicture)
            // Nếu Entity User của bạn có hàm setter thì dùng: existingUser.updateFullName(dto.fullName);
        }

        // Bước 4: Lưu dữ liệu đã thay đổi vào Database thông qua Repository
        const updatedUser = await this.userRepo.update(existingUser);

        return updatedUser;
    }

    // 2. Đổi mật khẩu
    async changePassword(userId: string, dto: ChangePasswordDTO) {
        // --- BƯỚC 1: CHEAP CHECK  ---
        // Làm ngay đầu tiên. Nếu lỗi, chặn luôn, không cần gọi Database làm gì cho mệt.
        if (dto.oldPassword === dto.newPassword) {
            throw new AppError(ErrorCode.VALIDATION.PASSWORD_MUST_BE_DIFFERENT);
        }

        // Kiểm tra độ phức tạp của pass mới (Tùy chọn)
        if (!dto.isPassword()) {
            throw new AppError(ErrorCode.VALIDATION.INVALID_PASSWORD);
        }


        if (!dto.isPasswordMapping()) {
            throw new AppError(ErrorCode.VALIDATION.CONFIRM_PASSWORD_MISMATCH);
        }

        // --- BƯỚC 2: DATABASE CHECK  ---
        // Tìm user trong cơ sở dữ liệu
        const existingUser = await this.userRepo.findById(userId);

        if (!existingUser || !existingUser.passwordHash) {
            throw new AppError(ErrorCode.USER.NOT_FOUND);
        }

        // --- BƯỚC 3: HEAVY CHECK  ---
        // Kiểm tra mật khẩu cũ (So sánh bản rõ với bản băm trong DB)
        const isMatch = await bcrypt.compare(dto.oldPassword, existingUser.passwordHash);

        if (!isMatch) {
            throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
        }

        // Bỏ qua bước kiểm tra isSamePassword bằng bcrypt ở đây vì BƯỚC 1 đã làm rồi!

        // --- BƯỚC 4: XỬ LÝ VÀ LƯU TRỮ ---
        // Băm mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);

        // Cập nhật Entity và lưu vào Database
        existingUser.updatePassword(hashedNewPassword);
        await this.userRepo.update(existingUser);

        // ==========================================
        // CÁC TRƯỜNG HỢP XỬ LÝ (TEST CASES FLOW)
        // ==========================================
        // TH1: Nhập mật khẩu mới GIỐNG HỆT mật khẩu cũ
        // -> Bị chặn ngay dòng đầu tiên (Chỉ tốn 1ms so sánh chuỗi). 
        // -> Quăng lỗi: Mật khẩu mới phải khác mật khẩu cũ.

        // TH2: Nhập SAI mật khẩu cũ 
        // -> Lọt qua bước 1, đi xuống gọi Database nhưng bị chặn ở hàm Bcrypt.
        // -> Quăng lỗi: Thông tin đăng nhập không chính xác (Invalid Credentials).

        // TH3: Nhập ĐÚNG mật khẩu cũ, VÀ mật khẩu mới ĐÃ KHÁC mật khẩu cũ
        // -> Vượt qua tất cả các vòng kiểm tra một cách hợp lệ.
        // -> Tiến hành băm (Hash) mật khẩu mới và lưu vào Database thành công!
        // ==========================================

        // Trả về thông báo thành công
        return { message: "Đổi mật khẩu thành công" };
    }

    // 3. Đổi trạng thái (Admin dùng)
    async updateStatus(userId: string, dto: ChangeStatusDTO) {
        // Bước 1: Tìm user trong cơ sở dữ liệu
        const existingUser = await this.userRepo.findById(userId);

        // Kiểm tra xem user có tồn tại không
        if (!existingUser) {
            throw new AppError(ErrorCode.USER.NOT_FOUND);
        }

        // Tùy chọn: Có thể kiểm tra xem trạng thái mới có giống trạng thái cũ không để tránh update thừa
        // if (existingUser.status === dto.status) {
        //     return { message: "Trạng thái không có gì thay đổi" };
        // }

        // Bước 2: Gọi phương thức của Entity để thay đổi trạng thái
        existingUser.updateStatus(dto.status as UserStatus);

        // Bước 3: Lưu sự thay đổi xuống Database thông qua Repository
        await this.userRepo.update(existingUser);

        // Trả về thông báo thành công cùng trạng thái mới
        return {
            message: "Cập nhật trạng thái thành công",
            newStatus: dto.status
        };
    }

    // 4. Xóa tài khoản
    async deleteUser(userId: string) {
        // Bước 1: Tìm user trong cơ sở dữ liệu
        const existingUser = await this.userRepo.findById(userId);

        // Kiểm tra xem user có tồn tại không
        if (!existingUser) {
            throw new AppError(ErrorCode.USER.NOT_FOUND);
        }

        existingUser.softDelete();

        // Bước 3: Lưu sự thay đổi xuống Database thông qua Repository
        await this.userRepo.update(existingUser);

        // Trả về thông báo thành công cùng trạng thái mới
        return {
            message: "Xóa tài khoản thành công",
        };
    }
}
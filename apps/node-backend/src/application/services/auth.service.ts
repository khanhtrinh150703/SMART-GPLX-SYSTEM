import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import bcrypt from 'bcrypt';
import { RegisterDTO } from '../dtos/request/auth.dto';
import { ErrorCode, AppError } from '@/shared/errors';
import { User } from '@/domain/entities/User';
import { LoginInputDTO } from '../dtos/request/loginInput.dto';

export class AuthService {
  constructor(private userRepo: IUserRepository) { }

  async register(dto: RegisterDTO) {
    // 0. Đo tổng thời gian cả hàm
    // console.log("\n--- STARTING REGISTER PROCESS ---");
    // console.time(">> TOTAL_API_RESPONSE_TIME");

    // --- 1. VALIDATION LAYER ---
    // console.time("Step 1: Validation (DTO Checks)");

    // Kiểm tra định dạng Email
    if (!dto.isEmail()) {
      // console.timeEnd("Step 1: Validation (DTO Checks)");
      throw new AppError(ErrorCode.VALIDATION.INVALID_EMAIL);
    }

    const normalizedUsername = dto.username.trim().toLowerCase();
    const normalizedEmail = dto.email.trim().toLowerCase();

    // Kiểm tra độ phức tạp mật khẩu (dùng phương thức riêng trong DTO)
    // Giả sử logic là: độ dài < 8 hoặc không khớp regex
    if (!dto.isPassword()) {
      // console.timeEnd("Step 1: Validation (DTO Checks)");
      throw new AppError(ErrorCode.VALIDATION.INVALID_PASSWORD);
    }

    // (Tùy chọn) Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
    if (!dto.isPasswordMapping()) {
      // console.timeEnd("Step 1: Validation (DTO Checks)");
      throw new AppError(ErrorCode.VALIDATION.CONFIRM_PASSWORD_MISMATCH);
    }
    // console.timeEnd("Step 1: Validation (DTO Checks)");


    // --- 2. BUSINESS LOGIC (CHECK EXISTENCE) ---
    // Đây thường là nơi Prisma khởi động (Cold Start) lần đầu
    // console.time("Step 2: DB_Find_Existing_Email (Cold Start Suspect)");
    const existingUser = await this.userRepo.checkUserExists(normalizedEmail, normalizedUsername);
    // console.timeEnd("Step 2: DB_Find_Existing_Email (Cold Start Suspect)");

    // Kiểm tra email đã tồn tại trong hệ thống chưa
    if (existingUser) {
      throw new AppError(ErrorCode.USER.EMAIL_EXISTS);
    }

    // --- 3. BCRYPT HASHING ---
    // console.time("Step 3: Bcrypt_Hashing_Process");
    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    // console.timeEnd("Step 3: Bcrypt_Hashing_Process");

    // --- 4. DB CREATE ---
    // Lưu vào Database qua Repository
    // console.time("Step 4: DB_Create_New_User_Record");
    const userToCreate = User.create({
      id: crypto.randomUUID(),
      username: normalizedUsername,
      email: normalizedEmail,
      fullName: dto.fullName,
      passwordHash: hashedPassword,
    });

    const newUser = await this.userRepo.create(userToCreate);

    if (!newUser) {
      // Ném lỗi ngay tại Service
      throw new AppError(ErrorCode.USER.REGISTER_FAILED);
    }
    // console.timeEnd("Step 4: DB_Create_New_User_Record");


    // // Kết thúc đo tổng
    // console.timeEnd(">> TOTAL_API_RESPONSE_TIME");
    // console.log("--- REGISTER PROCESS FINISHED ---\n");

    return newUser;
  }

  async login(dto: LoginInputDTO) {

    const normalizedUsername = dto.username.trim().toLowerCase();
    // const normalizedEmail = dto.email.trim().toLowerCase();

    // Kiểm tra độ phức tạp mật khẩu (dùng phương thức riêng trong DTO)
    // Giả sử logic là: độ dài < 8 hoặc không khớp regex
    const dbUser = await this.userRepo.findByUserName(normalizedUsername)

    // Bước 2: Chặn đứng nếu không thấy user
    if (!dbUser || !dbUser.passwordHash) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS); // Báo lỗi sai tài khoản/mật khẩu
    }

    // 3. So sánh mật khẩu (Compare, không phải Hash lại nhé!)
    const isMatch = await bcrypt.compare(dto.password, dbUser.passwordHash);
    if (!isMatch) {
      // Ghi log warn sang Loki nếu muốn theo dõi Brute-force
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
    }

    if (dbUser.isDeleted()) {
      throw new AppError(ErrorCode.AUTH.ACCOUNT_LOCKED); 
    }

    return dbUser;
  }

}
import { RegisterDTO } from '../dtos/request/auth.dto';
import { LoginInputDTO } from '../dtos/request/loginInput.dto';
import { ErrorCode, AppError } from '@/shared/errors';
import { User } from '@/domain/entities/User';
import { OtpService } from './otp.service';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export class AuthService {
  constructor(private userRepo: IUserRepository, private readonly otpService: OtpService) { }

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


  async initiateRegistration(dto: RegisterDTO): Promise<void> {
    // 1. Validation Layer (DTO Checks)
    this.validateRegistrationData(dto);

    const normalizedUsername = dto.username.trim().toLowerCase();
    const normalizedEmail = dto.email.trim().toLowerCase();

    // 2. Check Existence (Kiểm tra trong DB MySQL)
    const existingUser = await this.userRepo.checkUserExists(normalizedEmail, normalizedUsername);
    if (existingUser) {
      throw new AppError(ErrorCode.USER.EMAIL_EXISTS);
    }

    // 3. Hash Password ngay từ bây giờ 
    // Việc hash trước khi lưu vào Redis giúp bước sau (Verify) chạy cực nhanh
    // Lưu vào Redis (Pending) và gửi OTP
    await this.otpService.requestOtp(normalizedEmail, dto);
  }

  async login(dto: LoginInputDTO): Promise<User> {

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

  async completeRegistration(email: string, otp: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    // 1. Xác thực OTP
    await this.otpService.verifyOtp(normalizedEmail, otp);

    // 2. Lấy dữ liệu đã xác thực từ Redis (Kiểu RegisterDTO)
    // OtpService giờ trả về RegisterDTO, không còn any
    const userData: RegisterDTO = await this.otpService.getValidatedData(normalizedEmail);

    const normalizedUsername = userData.username.trim().toLowerCase();

    const hashedPassword = await bcrypt.hash(userData.password, 10);


    // 3. Tạo Entity và Lưu vào Database MySQL
    const userToCreate = User.create({
      id: crypto.randomUUID(),
      username: normalizedUsername,
      email: normalizedEmail,
      fullName: userData.fullName,
      passwordHash: hashedPassword, // Đây đã là password đã hash từ Bước 1
    });


    const newUser = await this.userRepo.create(userToCreate);

    if (!newUser) {
      throw new AppError(ErrorCode.USER.REGISTER_FAILED);
    }

    // 4. (Tùy chọn) Xóa dữ liệu tạm sau khi thành công
    this.otpService.deletePendingData(normalizedEmail);

    return newUser;
  }

  async resendOtp(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Lấy dữ liệu cũ từ Redis
    const pendingData = await this.otpService.getValidatedData(normalizedEmail);

    if (!pendingData) {
      throw new AppError(ErrorCode.AUTH.REGISTRATION_EXPIRED); // "Phiên đăng ký đã hết hạn"
    }

    // 2. (Tùy chọn) Kiểm tra Cool-down - Tránh spam API
    // Bạn có thể lưu một key phụ trong Redis như `resend_lock:email` với TTL 60s
    const isLocked = await this.otpService.isResendLocked(normalizedEmail);
    if (isLocked) {
      throw new AppError(ErrorCode.SYSTEM.TOO_MANY_REQUESTS); // "Thử lại sau 60 giây"
    }

    // 3. Gửi lại OTP mới
    // Lưu ý: Ta truyền lại chính cái `pendingData` (RegisterDTO) để giữ nguyên thông tin User
    await this.otpService.requestOtp(normalizedEmail, pendingData);
  }

  private validateRegistrationData(dto: RegisterDTO): void {
    if (!dto.isEmail()) throw new AppError(ErrorCode.VALIDATION.INVALID_EMAIL);
    if (!dto.isPassword()) throw new AppError(ErrorCode.VALIDATION.INVALID_PASSWORD);
    if (!dto.isPasswordMapping()) throw new AppError(ErrorCode.VALIDATION.CONFIRM_PASSWORD_MISMATCH);
  }
}
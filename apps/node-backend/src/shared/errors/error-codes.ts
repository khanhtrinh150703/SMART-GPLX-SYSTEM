/**
 * ErrorCode definition - Định nghĩa mã lỗi toàn hệ thống
 * Đã tinh chỉnh: Sửa lỗi trùng 409, phân tách rõ ràng các Domain.
 */
export const ErrorCode = {
  /** * --- SYSTEM & INFRASTRUCTURE (SYS) ---
   * Các lỗi tầng hạ tầng và phản hồi chung.
   */
  SYSTEM: {
    SUCCESS: "SYS_000",
    FILE_SIZE_EXCEEDED: "SYS_001",
    ALREADY_EXISTS: "SYS_002",
    INVALID_INPUT: "SYS_400", // Lỗi validation (dữ liệu sai)
    BAD_REQUEST: "SYS_401", // Lỗi request không hợp lệ nói chung
    REQUEST_TIMEOUT: "SYS_408",
    DUPLICATE_DATA: "SYS_409", // P2002: Trùng lặp dữ liệu (Unique constraint)
    RESOURCE_NOT_FOUND: "SYS_444", // P2025: Không tìm thấy bản ghi để thao tác
    RELATION_FAILED: "SYS_422", // P2003: Lỗi ràng buộc (Khóa ngoại không tồn tại)
    TOO_MANY_REQUESTS: "SYS_429",
    INTERNAL_ERROR: "SYS_500",
    SERVICE_UNAVAILABLE: "SYS_503",
    DATABASE_ERROR: "SYS_504",
    CONFIG_ERROR: "SYS_505",
  },

  /** * --- AUTHENTICATION & AUTHORIZATION (AUTH) ---
   * Bảo mật, phiên làm việc và định danh.
   */
  AUTH: {
    // --- Nhóm 1xx: Validation (Dữ liệu đầu vào) ---
    MISSING_FIELDS: "AUTH_100", // Thiếu các trường bắt buộc chung
    EMAIL_REQUIRED: "AUTH_101", // Email là bắt buộc (Mới)
    EMAIL_INVALID: "AUTH_102", // Email không đúng định dạng
    OTP_REQUIRED: "AUTH_103", // Mã OTP là bắt buộc (Mới)
    OTP_INVALID: "AUTH_104", // Mã OTP sai
    OTP_EXPIRED: "AUTH_105", // Mã OTP đã hết hạn
    PASSWORD_REQUIRED: "AUTH_106", // Mật khẩu là bắt buộc
    NEW_PASSWORD_REQUIRED: "AUTH_107", // Mật khẩu mới là bắt buộc (Mới)
    PASSWORD_TOO_WEAK: "AUTH_108", // Mật khẩu quá yếu
    PASSWORD_MISMATCH: "AUTH_110", // Mật khẩu xác nhận không khớp
    USERNAME_REQUIRED: "AUTH_111", // Tên đăng nhập là bắt buộc
    USERNAME_INVALID: "AUTH_112", // Tên đăng nhập không hợp lệ
    REFRESH_TOKEN_REQUIRED: "AUTH_113", // Thiếu Refresh Token

    // --- Nhóm 4xx: Security & Session (Bảo mật và Phiên làm việc) ---
    UNAUTHORIZED: "AUTH_401", // Chưa đăng nhập / Token sai
    TOKEN_EXPIRED: "AUTH_402", // Access Token hết hạn
    FORBIDDEN: "AUTH_403", // Không có quyền truy cập
    INVALID_TOKEN: "AUTH_404", // Token không hợp lệ (sai chữ ký)
    NOT_ACTIVATED: "AUTH_405", // Tài khoản chưa verify
    ROLES_NOT_INITIALIZED: "AUTH_406", // Role chưa được thiết lập
    INVALID_CREDENTIALS: "AUTH_407", // Sai tài khoản hoặc mật khẩu
    INVALID_REFRESH_TOKEN: "AUTH_408", // Refresh token không hợp lệ
    REFRESH_FAILED: "AUTH_409", // Làm mới token thất bại
    REGISTRATION_EXPIRED: "AUTH_410", // Phiên đăng ký hết hạn
    ACCOUNT_LOCKED: "AUTH_423", // Tài khoản bị khóa
  },

  /** * --- USER & PROFILE (USER) ---
   * Nghiệp vụ liên quan đến tài khoản người dùng.
   */

  USER: {
    // --- Nhóm 1xx: Validation (Dữ liệu đầu vào) ---
    NAME_REQUIRED: "USER_101", // Họ tên là bắt buộc
    NAME_TOO_SHORT: "USER_102", // Họ tên quá ngắn
    NAME_TOO_LONG: "USER_103", // Họ tên quá dài
    NAME_INVALID: "USER_104", // Họ tên chứa ký tự đặc biệt
    STATUS_INVALID: "USER_105", // Trạng thái không hợp lệ
    ROLES_REQUIRED: "USER_106", // Thiếu vai trò
    INVALID_ROLE_ID: "USER_107", // ID vai trò sai định dạng
    AVATAR_TOO_LARGE: "USER_108", // Ảnh quá nặng
    AVATAR_INVALID_TYPE: "USER_109", // Sai định dạng ảnh
    MISSING_UPDATE_FIELDS: "USER_110", // Không có dữ liệu để update
    STATUS_REQUIRED: "USER_112", // Thiếu trạng thái cần cập nhật
    INVALID_ROLES_FORMAT: "USER_111", // Roles phải là mảng
    OLD_PASSWORD_REQUIRED: "USER_120", // Thiếu mật khẩu cũ
    NEW_PASSWORD_REQUIRED: "USER_121", // Thiếu mật khẩu mới
    PASSWORD_MUST_BE_DIFFERENT: "USER_122", // Mật khẩu mới phải khác mật khẩu cũ
    PASSWORD_TOO_WEAK: "USER_123", // Mật khẩu mới không đủ độ mạnh

    // --- Nhóm 4xx: State & Conflict (Trạng thái & Trùng lặp) ---
    NOT_FOUND: "USER_404",
    EMAIL_EXISTS: "USER_409",
    USERNAME_EXISTS: "USER_410",
    PHONE_EXISTS: "USER_411",

    // --- Nhóm 0xx/5xx: Operation (Lỗi thực thi) ---
    REGISTER_FAILED: "USER_003",
    UPDATE_FAILED: "USER_004",
  },

  /** * --- SMART-GPLX DOMAIN (EXAM) ---
   * Lỗi đặc thù cho hệ thống thi bằng lái xe.
   */
  EXAM: {
    // --- Nhóm 1xx: Lỗi dữ liệu đầu vào (Validation) ---
    ID_REQUIRED: "EXM_100",
    IMAGE_INVALID: "EXM_101", // Ảnh không hợp lệ
    ANSWERS_EMPTY: "EXM_102", // Danh sách câu trả lời trống
    ANSWER_FORMAT_INVALID: "EXM_103", // Định dạng câu trả lời sai
    NAME_REQUIRED: "EXM_104", // Tên không được để trống
    NAME_TOO_LONG: "EXM_105", // Tên quá dài
    INVALID_MATRIX_ID: "EXM_106", // Mã ma trận đề thi không hợp lệ
    USER_ID_REQUIRED: "EXM_107", // Thiếu ID người tạo
    LICENSE_CATEGORY_REQUIRED: "EXM_108", // Thiếu hạng bằng lái
    QUESTIONS_EMPTY: "EXM_109", // Danh sách câu hỏi không được trống
    INVALID_DURATION: "EXM_110", // Thời gian thi không hợp lệ
    PASSING_SCORE_TOO_HIGH: "EXM_111", // Điểm đạt vượt quá tổng số câu
    MIN_CRITICAL_INVALID: "EXM_112", // Số câu điểm liệt tối thiểu không hợp lệ
    INVALID_TIME_RANGE: "EXM_113", // Thời gian kết thúc phải sau thời gian bắt đầu
    TOTAL_QUESTIONS_INVALID: "EXM_114", // Tổng số câu hỏi không hợp lệ
    NAME_ALREADY_EXISTS: "EXM_115", // Tên đề thi đã tồn tại
    
    // --- Nhóm 2xx: Lỗi nghiệp vụ & Kho dữ liệu (Pool & Business) ---
    INSUFFICIENT_POOL_QUESTIONS: "EXM_201", // Tổng kho không đủ câu hỏi
    INSUFFICIENT_CHAPTER_QUESTIONS: "EXM_202", // Thiếu câu hỏi theo chương mục
    INSUFFICIENT_CRITICAL_QUESTIONS: "EXM_203", // Thiếu câu hỏi điểm liệt
    QUESTION_DATA_INVALID: "EXM_204", // Dữ liệu câu hỏi trong kho bị lỗi/thiếu

    // --- Nhóm 4xx: Lỗi trạng thái & Luồng thực thi (Flow & State) ---
    NOT_FOUND: "EXM_404", // Không tìm thấy bài thi (Dùng 404 cho dễ nhớ)
    ALREADY_SUBMITTED: "EXM_409", // Đã nộp bài trước đó (Dùng 409 - Conflict)
    EXPIRED: "EXM_410", // Hết giờ làm bài (Dùng 410 - Gone)

    // --- Nhóm 5xx: Lỗi xử lý hạ tầng & AI (System/AI) ---
    AI_PROCESSING_ERROR: "EXM_500", // Lỗi xử lý AI (Giải thích đáp án...)
  },

  /** * --- RESOURCE & UPLOAD (FILE) ---
   * Quản lý hình ảnh, tài liệu.
   */
  FILE: {
    UPLOAD_FAILED: "FILE_500", // Lỗi upload lên Cloud/Server
    TOO_LARGE: "FILE_413", // File quá nặng
    INVALID_TYPE: "FILE_415", // Sai định dạng (Cần .jpg, .png...)
    NOT_FOUND: "FILE_404", // Tệp tin không tồn tại (Dịch: File not found)
  },

  /** * --- DATA VALIDATION (VAL) ---
   * Kiểm tra format đầu vào (Dùng cho Class Validator).
   */
  VALIDATION: {
    // --- 0xx: General Required & Format (Lỗi chung & Định dạng) ---
    REQUIRED: "VAL_000",
    ID_REQUIRED: "VAL_001",
    NAME_REQUIRED: "VAL_002",
    DESCRIPTION_REQUIRED: "VAL_003",
    INVALID_FORMAT: "VAL_004",
    INVALID_LENGTH: "VAL_005",
    CODE_REQUIRED: "VAL_006",
    INVALID_NUMBER: "VAL_007", // Định dạng số không hợp lệ
    INVALID_INPUT: "VAL_008",

    // --- 1xx: Identity & Contact (Định danh & Liên lạc) ---
    EMAIL_INVALID: "VAL_101",
    NAME_INVALID_LENGTH: "VAL_102",
    NAME_FORMAT_INVALID: "VAL_103",
    DESCRIPTION_TOO_LONG: "VAL_104",

    // --- 2xx: Security & Authentication (Mật khẩu & Token) ---
    PASSWORD_INVALID: "VAL_201",
    PASSWORD_CONFIRM_MISMATCH: "VAL_202",
    PASSWORD_MUST_BE_DIFFERENT: "VAL_203",
    REFRESH_TOKEN_REQUIRED: "VAL_204",
    REFRESH_TOKEN_INVALID: "VAL_205",
    PASSWORD_TOO_SHORT: "VAL_206",

    // --- 3xx: Specific Business Logic (Logic nghiệp vụ cụ thể) ---
    AGE_MUST_BE_NUMBER: "VAL_301",
    AGE_INVALID: "VAL_302",
    INVALID_PERCENTAGE: "VAL_303",

    // --- 4xx: Exam & Training (Đề thi & Đào tạo) ---
    LICENSE_CATEGORY_REQUIRED: "VAL_401", // Hạng bằng lái bắt buộc
    EXAM_QUESTIONS_EMPTY: "VAL_402", // Danh sách câu hỏi không được trống
    INVALID_DURATION: "VAL_403", // Thời gian thi không hợp lệ (phải > 0)
    PASSING_SCORE_TOO_HIGH: "VAL_404", // Điểm đạt không được lớn hơn tổng số câu
    MATRIX_ID_REQUIRED: "VAL_405", // Mã ma trận đề bắt buộc (cho Auto-gen)
    USER_ID_REQUIRED: "VAL_406", // ID thí sinh bắt buộc
    MIN_CRITICAL_INVALID: "VAL_407", // Số câu điểm liệt yêu cầu không hợp lệ
    RESTORE_FAILED_DUPLICATE: "VAL_411", // Khôi phục thất bại do dữ liệu đã tồn tại (Trùng lặp)
  },

  LICENSE: {
    // --- Nhóm Validation (Kiểm tra dữ liệu đầu vào) ---
    ID_REQUIRED: "LIC_100", // ID không được để trống
    NAME_REQUIRED: "LIC_101", // Tên hạng bằng không được trống
    NAME_INVALID_LENGTH: "LIC_102", // Độ dài tên không hợp lệ (1-10 ký tự)
    NAME_FORMAT_INVALID: "LIC_103", // Tên hạng bằng sai định dạng (Regex)
    AGE_REQUIRED: "LIC_104", // Độ tuổi là bắt buộc
    AGE_INVALID: "LIC_105", // Độ tuổi không đạt yêu cầu tối thiểu (18 tuổi)
    DESCRIPTION_REQUIRED: "LIC_106", // Mô tả không được trống
    DESCRIPTION_TOO_LONG: "LIC_107", // Mô tả quá dài (tối đa 500 ký tự)
    INVALID_ORDER: "LIC_108", // Thứ tự hiển thị không hợp lệ

    // --- Nhóm Logic & Database (Kiểm tra nghiệp vụ) ---
    NOT_FOUND: "LIC_404", // Không tìm thấy hạng bằng
    ALREADY_EXISTS: "LIC_409", // Dữ liệu đã tồn tại nói chung
    NAME_ALREADY_EXISTS: "LIC_410", // Tên hạng bằng đã tồn tại
    IS_IN_USE: "LIC_411", // Hạng bằng đang được sử dụng, không thể xóa/sửa
  },

  CHAPTER: {
    CREATE_FAILED: "CHPT_001", // Lỗi khi tạo mới
    UPDATE_FAILED: "CHPT_002", // Lỗi khi cập nhật
    INVALID_ORDER: "CHPT_003", // Thứ tự hiển thị không hợp lệ
    INVALID_DESCRIPTION: "CHPT_004",
    INVALID_CODE: "CHPT_005", // Mã chương không hợp lệ (Sai định dạng Regex)
    ID_REQUIRED: "CHPT_100", // Thiếu ID chương để cập nhật
    NAME_REQUIRED: "CHPT_101", // Tên chương không được trống
    CODE_REQUIRED: "CHPT_102", // Mã chương không được trống
    DESCRIPTION_REQUIRED: "CHPT_103", // Mô tả không được trống
    DESCRIPTION_TOO_LONG: "CHPT_104", // Mô tả quá dài

    IS_IN_USE: "CHPT_411", // Vi phạm ràng buộc (có câu hỏi)
    NOT_FOUND: "CHPT_404", // Không tìm thấy chương
    NAME_ALREADY_EXISTS: "CHPT_409", // Trùng TÊN chương (Đổi từ ALREADY_EXISTS)
    CODE_ALREADY_EXISTS: "CHPT_410", // Trùng MÃ chương (Thêm mới)
  },

  QUESTION: {
    // --- 0xx: Validation (Lúc khởi tạo/nội dung) ---
    CHAPTER_REQUIRED: "QST_001", // Thiếu ID chương
    CONTENT_INVALID: "QST_002", // Nội dung không hợp lệ (ngắn quá)
    LICENSE_REQUIRED: "QST_003", // Thiếu hạng bằng lái
    ANSWERS_INSUFFICIENT: "QST_004", // Thiếu số lượng đáp án (min 2)
    CORRECT_ANSWER_MISSING: "QST_005", // Thiếu đáp án đúng
    IMAGE_URL_INVALID: "QST_006", // Link ảnh không hợp lệ

    // --- 1xx: Format & Logic Validation ---
    ID_REQUIRED: "QST_100", // Thiếu ID câu hỏi để cập nhật
    INVALID_FORMAT: "QST_101", // Dữ liệu câu hỏi gửi lên sai định dạng
    MULTIPLE_CORRECT_ANSWERS: "QST_102", // Có nhiều hơn 1 đáp án đúng
    ANSWER_CONTENT_REQUIRED: "QST_103", // Nội dung đáp án không được trống
    EXPLANATION_TOO_LONG: "QST_104", // Giải thích đáp án quá dài
    LICENSE_ID_INVALID: "QST_105", // Mã hạng bằng lái không hợp lệ
    DIFFICULTY_INVALID: "QST_106", // Mức độ khó không hợp lệ
    INDEX_INVALID: "QST_107", // Số thứ tự câu hỏi không hợp lệ
    STATUS_INVALID: "QST_108", // Trạng thái câu hỏi không hợp lệ
    IS_CRITICAL_INVALID: "QST_109", // Giá trị câu hỏi điểm liệt phải là boolean

    // --- 4xx: Data Lifecycle & Integrity ---
    NOT_FOUND: "QST_404", // Không tìm thấy câu hỏi cụ thể theo ID
    EMPTY_BANK: "QST_405", // Ngân hàng câu hỏi cho hạng bằng này đang trống (Không tìm thấy bất kỳ câu nào)
    INCOMPLETE_DATA_SET: "QST_406", // Dữ liệu câu hỏi không đầy đủ để tạo bộ đề (Ví dụ: cần 35, chỉ có 20)
    ALREADY_EXISTS: "QST_409", // Câu hỏi đã tồn tại (trùng nội dung)
    DELETE_CRITICAL_RESTRICTED: "QST_403", // Hành động bị cấm do luật nghiệp vụ

    // --- 5xx: System Errors ---
    ANSWERS_SYNC_FAILED: "QST_500", // Lỗi xử lý dữ liệu hệ thống
  },

  IMPORT: {
    JOB_NOT_FOUND: "IMP_001", // IMPORT_JOB_NOT_FOUND
    JOB_INVALID_STATUS: "IMP_002", // IMPORT_JOB_INVALID_STATUS
    INVALID_CHUNK_INDEX: "IMP_003", // INVALID_CHUNK_INDEX
    EXTRACT_FAILED: "IMP_004", // EXTRACT_FAILED
    FILE_MISSING: "IMP_005", // FILE_MISSING
    CHUNK_SIZE_EXCEEDED: "IMP_006", // CHUNK_SIZE_EXCEEDED
    SESSION_EXPIRED: "IMP_007", // IMPORT_SESSION_EXPIRED
    FILE_NAME_REQUIRED: "IMP_101", // Tên tệp không được để trống
    INVALID_TOTAL_SIZE: "IMP_102", // Kích thước tệp không hợp lệ
    INVALID_TOTAL_CHUNKS: "IMP_103", // Số lượng mảnh (chunks) không hợp lệ
    JOB_ID_REQUIRED: "IMP_104", // Mã công việc import là bắt buộc
  },

  MATRIX: {
    // --- Nhóm 1xx: Validation (Lỗi nhập liệu) ---
    ID_REQUIRED: "MTX_100", // Thiếu ID ma trận để cập nhật
    NAME_REQUIRED: "MTX_101", // Tên ma trận không được trống
    NAME_TOO_LONG: "MTX_102", // Tên ma trận quá dài
    NO_DETAILS: "MTX_103", // Ma trận không có chi tiết cấu trúc
    INVALID_PERCENTAGE: "MTX_104", // Tỷ lệ phần trăm không hợp lệ
    INVALID_PASSING_SCORE: "MTX_105", // Điểm đạt không hợp lệ
    DUPLICATE_CHAPTER: "MTX_106", // Trùng lặp chương trong ma trận
    INVALID_TOTAL_QUESTIONS: "MTX_107",
    INVALID_DURATION: "MTX_108",
    CHAPTER_ID_REQUIRED: "MTX_109",
    LICENSE_CATEGORY_REQUIRED: "MTX_110", // Thiếu hạng bằng lái
    MISSING_FIELDS: "MTX_111", // Thiếu các trường bắt buộc
    PASSING_SCORE_TOO_HIGH: "MTX_112", // Điểm đạt vượt quá tổng số câu
    MIN_CRITICAL_INVALID: "MTX_113", // Số câu điểm liệt không hợp lệ
    IS_DEFAULT_INVALID: "MTX_114", // Giá trị isDefault phải là boolean
    TOTAL_PERCENTAGE_NOT_100: "MTX_115", // Tổng tỉ lệ phần trăm không bằng 100%
    CHAPTER_PERCENTAGE_OUT_OF_RANGE: "MTX_116", // Tỉ lệ chương phải lớn hơn 0% và <= 100%
    TOO_MANY_CHAPTERS_FOR_TOTAL: "MTX_117", // Số lượng chương vượt quá tổng số câu hỏi
    MIN_CRITICAL_REQUIRED: "MTX_118", // Thiếu số câu điểm liệt tối thiểu
    MIN_CRITICAL_NEGATIVE: "MTX_119", // Số câu điểm liệt không được là số âm
    MIN_CRITICAL_TOO_HIGH: "MTX_120", // Số câu điểm liệt vượt quá tổng số câu của ma trận
    NAME_ALREADY_EXISTS: "MTX_121", // Tên ma trận đã tồn tại

    // --- Nhóm 4xx: State/Management (Lỗi trạng thái/Quản lý) ---
    NOT_FOUND: "MTX_404", // Không tìm thấy ma trận
    RESTORE_FAILED_DUPLICATE: "MTX_409", // Khôi phục thất bại do trùng tên đã tồn tại
  },

  EXCEL: {
    WORKSHEET_NOT_FOUND: "EXCEL_001",
    INVALID_FORMAT: "EXCEL_002",
    EMPTY_FILE: "EXCEL_003",
  },

  PROCESS: {
    ALREADY_COMPLETED: "PRC_001", // Process Error 001
  },

  MEDIA: {
    // --- Nhóm 1xx: Validation (Lỗi dữ liệu đầu vào) ---
    SOURCE_REQUIRED: "MED_101", // Nguồn (path/url/buffer) không được để trống
    INVALID_TYPE: "MED_102", // Loại file không hỗ trợ
    FILE_TOO_LARGE: "MED_103", // File quá dung lượng
    UPLOAD_FAILED: "MED_501", // Lỗi khi upload lên Storage (S3, Cloudinary...)
  },

  EXAM_ATTEMPT: {
    ID_REQUIRED: "EXA_000",
    NOT_FOUND: "EXA_001",
    ALREADY_SUBMITTED: "EXA_002",
    TIME_EXPIRED: "EXA_003",
    SCORE_INVALID: "EXA_004",
    RESULT_CONSISTENCY_ERROR: "EXA_005",
    NOT_IN_PROGRESS: "EXA_006",
    UNAUTHORIZED_ACCESS: "EXA_007",
  },

  ACTIVE_SESSION: {
    NOT_FOUND: "SES_001",
    EXPIRED: "SES_002",
    REVOKED: "SES_003",
    MAX_SESSIONS_REACHED: "SES_004",
    INVALID_TOKEN: "SES_005",
    DEVICE_MISMATCH: "SES_006",
    INVALID_EXPIRATION_TIME: "SES_007",
  },

  CACHE: {
    NOT_INITIALIZED: "CSH_500", // Bộ nhớ đệm chưa được khởi tạo
    EMPTY_DATA: "CSH_501", // Dữ liệu từ Database rỗng, không thể nạp cache
    REFRESH_FAILED: "CSH_502", // Làm mới bộ nhớ đệm thất bại
    KEY_NOT_FOUND: "CSH_404", // Không tìm thấy khóa dữ liệu trong cache
  },

  /** --- MONGODB INFRASTRUCTURE (MDB) --- */
  MONGODB: {
    CONNECTION_ERROR: "MDB_001",
    NOT_INITIALIZED: "MDB_002",
    TRANSACTION_FAILED: "MDB_003", // Lỗi liên quan đến session/transaction
    QUERY_TIMEOUT: "MDB_004",
  },

  SESSION: {
    // --- 1xx: Validation (Lỗi đầu vào khi thao tác phiên thi) ---
    EXAM_ID_REQUIRED: "SES_100",
    INVALID_EXAM_ID: "SES_101", // ID đề thi không hợp lệ khi start
    INVALID_QUESTION_ID: "SES_102", // ID câu hỏi không thuộc phiên thi này
    ANSWER_FORMAT_INVALID: "SES_103", // Định dạng đáp án không đúng (number/null)
    ANSWERS_REQUIRED: "SES_104", // Danh sách câu trả lời không được trống
    DUPLICATE_QUESTION: "SES_105", // Một câu hỏi không thể có nhiều đáp án
    INVALID_ANSWER_VALUE: "SES_106", // Giá trị đáp án phải là số nguyên dương
    INVALID_QUESTION_INDEX: "SES_107", // Chỉ số câu hỏi không hợp lệ (không phải số hoặc âm)
    CLIENT_TIMESTAMP_REQUIRED: "SES_108", // Thiếu thời gian gửi từ client (clientTimestamp)
    SESSION_ID_REQUIRED: "SES_109", // ID phiên làm việc không được để trống
    INVALID_TIME_SPENT: "SES_110", // Thời gian đã dùng không hợp lệ (Mới)
    INVALID_TIME_REMAINING: "SES_111", // Thời gian còn lại không hợp lệ (Mới)
    INVALID_FINISHED_DATE: "SES_112", // Ngày kết thúc không hợp lệ (Mới)

    // --- 4xx: Flow & State (Lỗi luồng nghiệp vụ) ---
    NOT_FOUND: "SES_404", // Không tìm thấy phiên thi (Session ID sai)
    ALREADY_SUBMITTED: "SES_409", // Đã nộp bài, không được sửa đáp án
    EXPIRED: "SES_410", // Đã hết giờ làm bài
  },

  /** * --- EXAM HISTORY (EH) ---
   * Các lỗi liên quan đến lịch sử thi.
   */
  EXAM_HISTORY: {
    INVALID_DURATION: "EH_001", // Đã có
    INVALID_SCORE: "EH_002", // Đã có
    USER_ID_REQUIRED: "EH_003", // Thiếu định danh người dùng
    SNAPSHOT_ID_REQUIRED: "EH_004", // Thiếu định danh bản ghi câu trả lời (NoSQL)
    CATEGORY_INFO_REQUIRED: "EH_005", // Thiếu thông tin hạng bằng (A1, B2...)
    SCORE_CANNOT_BE_NEGATIVE: "EH_006", // Cấu trúc điểm số không logic (âm hoặc > tổng câu)
    RESULT_STATUS_REQUIRED: "EH_007", // Thiếu trạng thái Đạt/Trượt
    TOTAL_QUESTIONS_INVALID: "EH_008", // Tổng số câu hỏi phải lớn hơn 0
    SCORE_EXCEEDS_TOTAL: "EH_009", // Điểm số vượt quá tổng số câu hỏi

    HISTORY_NOT_FOUND: "EH_404",
  },

  // Thống kê chung
  STATISTICS: {
    NOT_FOUND: "ST_001",
    DATA_EMPTY: "ST_002",
    CALCULATION_ERROR: "ST_003",
    INVALID_TIME_RANGE: "ST_004",
  },

  /** * --- USER STATISTICS (US) ---
   * Các lỗi liên quan đến thống kê người dùng.
   */
  // Thống kê người dùng
  USER_STATS: {
    INVALID_TOTAL_EXAMS: "US_001",
    USER_NOT_FOUND: "US_002",
    SYNC_FAILED: "US_003",
  },

  /** * --- USER TOPIC STATISTICS (UTS) ---
   * Thống kê tiến độ và kết quả của người dùng theo từng chủ đề/hạng bằng.
   */
  USER_TOPIC_STATS: {
    TOPIC_ID_REQUIRED: "UTS_001", // ID chủ đề là bắt buộc
    INVALID_COMPLETION_RATE: "UTS_002", // Tỉ lệ hoàn thành không hợp lệ (phải từ 0-100)
    TOPIC_NOT_FOUND: "UTS_003", // Không tìm thấy dữ liệu thống kê cho chủ đề này
    TOTAL_QUESTIONS_NEGATIVE: "UTS_004", // Tổng số câu hỏi không được âm
    WRONG_ANSWERS_EXCEEDS_TOTAL: "UTS_005", // Số câu sai vượt quá tổng số câu

    USER_ID_REQUIRED: "UTS_006", // Thiếu định danh người dùng
    RESULTS_REQUIRED: "UTS_007", // Danh sách kết quả trống hoặc không hợp lệ
    TOPIC_NAME_REQUIRED: "UTS_008", // Thiếu tên chủ đề trong dữ liệu delta
    CORRECT_STATUS_REQUIRED: "UTS_009", // Trạng thái đúng/sai phải là boolean
  },

  /** * --- QUESTION STATISTICS (QS) ---
   * Các lỗi liên quan đến thống kê chi tiết từng câu hỏi.
   */
  QUESTION_STATS: {
    QUESTION_ID_REQUIRED: "QS_001", // ID câu hỏi là bắt buộc
  },
} as const;

export type ErrorCodeType = {
  [K in keyof typeof ErrorCode]: (typeof ErrorCode)[K][keyof (typeof ErrorCode)[K]];
}[keyof typeof ErrorCode];

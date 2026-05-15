import { ErrorCode, ErrorCodeType } from '../error-codes';

/**
 * Vietnamese Error Messages
 * Danh sách thông báo lỗi chi tiết, giúp người dùng dễ dàng hiểu vấn đề.
 */
export const ErrorMessages: Record<ErrorCodeType, string> = {
    // === SYSTEM & INFRASTRUCTURE (SYS) ===
    [ErrorCode.SYSTEM.SUCCESS]: 'Thao tác thực hiện thành công.',
    [ErrorCode.SYSTEM.INTERNAL_ERROR]: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.',
    [ErrorCode.SYSTEM.ALREADY_EXISTS]: 'Dữ liệu đã tồn tại trong hệ thống.',
    [ErrorCode.SYSTEM.SERVICE_UNAVAILABLE]: 'Máy chủ đang bảo trì, vui lòng quay lại sau.',
    [ErrorCode.SYSTEM.DATABASE_ERROR]: 'Lỗi kết nối cơ sở dữ liệu, vui lòng thử lại.',
    [ErrorCode.SYSTEM.TOO_MANY_REQUESTS]: 'Bạn thao tác quá nhanh, vui lòng đợi một lát.',
    [ErrorCode.SYSTEM.REQUEST_TIMEOUT]: 'Yêu cầu xử lý quá thời gian quy định, vui lòng thử lại.',
    [ErrorCode.SYSTEM.CONFIG_ERROR]: "Hệ thống gặp sự cố về cấu hình kỹ thuật. Vui lòng liên hệ bộ phận kỹ thuật.",
    [ErrorCode.SYSTEM.FILE_SIZE_EXCEEDED]: "Kích thước tệp tin vượt quá giới hạn cho phép.",
    [ErrorCode.SYSTEM.INVALID_INPUT]: 'Dữ liệu đầu vào không hợp lệ hoặc không đúng định dạng. Vui lòng kiểm tra lại các trường thông tin.',
    [ErrorCode.SYSTEM.BAD_REQUEST]: 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại dữ liệu gửi đi.',
    [ErrorCode.SYSTEM.DUPLICATE_DATA]: 'Dữ liệu đã tồn tại trong hệ thống, không thể tạo trùng lặp.',
    [ErrorCode.SYSTEM.RESOURCE_NOT_FOUND]: 'Thao tác thất bại do không tìm thấy dữ liệu tương ứng trên hệ thống.',
    [ErrorCode.SYSTEM.RELATION_FAILED]: 'Không thể thực hiện thao tác do vi phạm ràng buộc dữ liệu liên quan.',

    // === AUTHENTICATION & AUTHORIZATION (AUTH) ===
    [ErrorCode.AUTH.UNAUTHORIZED]: 'Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại.',
    [ErrorCode.AUTH.FORBIDDEN]: 'Bạn không có quyền thực hiện hành động này.',
    [ErrorCode.AUTH.TOKEN_EXPIRED]: 'Phiên làm việc đã hết hạn, vui lòng đăng nhập lại.',
    [ErrorCode.AUTH.INVALID_REFRESH_TOKEN]: 'Mã thông báo làm mới không hợp lệ.',
    [ErrorCode.AUTH.REFRESH_FAILED]: 'Cập nhật mã thông báo thất bại.',
    [ErrorCode.AUTH.INVALID_CREDENTIALS]: 'Tài khoản hoặc mật khẩu không chính xác.',
    [ErrorCode.AUTH.ACCOUNT_LOCKED]: 'Tài khoản đã bị khóa do vi phạm chính sách hệ thống.',
    [ErrorCode.AUTH.NOT_ACTIVATED]: 'Tài khoản chưa được kích hoạt, vui lòng xác thực Email/OTP.',
    [ErrorCode.AUTH.OTP_INVALID]: 'Mã xác thực (OTP) không chính xác.',
    [ErrorCode.AUTH.OTP_EXPIRED]: 'Mã xác thực đã hết hiệu lực, vui lòng lấy mã mới.',
    [ErrorCode.AUTH.REGISTRATION_EXPIRED]: 'Liên kết đăng ký đã hết hạn hoặc không còn tồn tại, vui lòng thực hiện lại quy trình đăng ký.',
    [ErrorCode.AUTH.MISSING_FIELDS]: "Vui lòng nhập đầy đủ các thông tin bắt buộc.",
    [ErrorCode.AUTH.INVALID_TOKEN]: "Mã xác thực không hợp lệ",
    [ErrorCode.AUTH.USERNAME_REQUIRED]: 'Tên đăng nhập không được để trống.',
    [ErrorCode.AUTH.PASSWORD_REQUIRED]: 'Mật khẩu không được để trống.',
    [ErrorCode.AUTH.USERNAME_INVALID]: 'Tên đăng nhập không hợp lệ (phải là chuỗi ký tự).',
    [ErrorCode.AUTH.REFRESH_TOKEN_REQUIRED]: 'Refresh Token không được để trống.',
    [ErrorCode.AUTH.EMAIL_INVALID]: 'Địa chỉ email không hợp lệ.',
    [ErrorCode.AUTH.PASSWORD_TOO_WEAK]: 'Mật khẩu phải từ 8 ký tự trở lên và bao gồm chữ hoa, chữ thường, số.',
    [ErrorCode.AUTH.PASSWORD_MISMATCH]: 'Mật khẩu xác nhận không khớp.',
    [ErrorCode.AUTH.ROLES_NOT_INITIALIZED]: 'Vai trò người dùng chưa được khởi tạo hoặc không tồn tại trong hệ thống.',
    [ErrorCode.AUTH.EMAIL_REQUIRED]: 'Vui lòng nhập địa chỉ email.',
    [ErrorCode.AUTH.OTP_REQUIRED]: 'Vui lòng nhập mã xác thực OTP.',
    [ErrorCode.AUTH.NEW_PASSWORD_REQUIRED]: 'Vui lòng nhập mật khẩu mới.',


    // === USER & PROFILE (USER) ===
    [ErrorCode.USER.NOT_FOUND]: 'Người dùng không tồn tại trên hệ thống.',
    [ErrorCode.USER.EMAIL_EXISTS]: 'Địa chỉ email này đã được sử dụng.',
    [ErrorCode.USER.USERNAME_EXISTS]: 'Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác.',
    [ErrorCode.USER.PHONE_EXISTS]: 'Số điện thoại này đã được đăng ký.',
    [ErrorCode.USER.REGISTER_FAILED]: 'Quá trình đăng ký gặp lỗi, vui lòng kiểm tra lại.',
    [ErrorCode.USER.UPDATE_FAILED]: 'Cập nhật thông tin không thành công.',
    [ErrorCode.USER.NAME_REQUIRED]: 'Họ và tên không được để trống.',
    [ErrorCode.USER.NAME_TOO_SHORT]: 'Họ tên quá ngắn, vui lòng nhập tối thiểu 2 ký tự.',
    [ErrorCode.USER.NAME_TOO_LONG]: 'Họ tên quá dài, tối đa không quá 100 ký tự.',
    [ErrorCode.USER.NAME_INVALID]: 'Họ tên chứa ký tự không hợp lệ.',
    [ErrorCode.USER.STATUS_INVALID]: 'Trạng thái tài khoản không hợp lệ.',
    [ErrorCode.USER.ROLES_REQUIRED]: 'Người dùng phải được gán ít nhất một vai trò.',
    [ErrorCode.USER.INVALID_ROLE_ID]: 'Một hoặc nhiều vai trò được chọn không tồn tại trên hệ thống.',
    [ErrorCode.USER.AVATAR_TOO_LARGE]: 'Dung lượng ảnh đại diện không được vượt quá 5MB.',
    [ErrorCode.USER.AVATAR_INVALID_TYPE]: 'Định dạng tệp không hỗ trợ. Vui lòng sử dụng JPG, PNG hoặc WEBP.',
    [ErrorCode.USER.MISSING_UPDATE_FIELDS]: 'Vui lòng cung cấp thông tin cần cập nhật.',
    [ErrorCode.USER.INVALID_ROLES_FORMAT]: 'Danh sách vai trò không đúng định dạng.',
    [ErrorCode.USER.OLD_PASSWORD_REQUIRED]: 'Vui lòng nhập mật khẩu hiện tại.',
    [ErrorCode.USER.NEW_PASSWORD_REQUIRED]: 'Vui lòng nhập mật khẩu mới.',
    [ErrorCode.USER.PASSWORD_MUST_BE_DIFFERENT]: 'Mật khẩu mới không được trùng với mật khẩu hiện tại.',
    [ErrorCode.USER.PASSWORD_TOO_WEAK]: 'Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
    [ErrorCode.USER.STATUS_REQUIRED]: 'Trạng thái tài khoản là bắt buộc.',

    // === SMART-GPLX (EXAM & AI) ===
    [ErrorCode.EXAM.ID_REQUIRED]: 'Mã định danh (ID) đề thi là bắt buộc.',
    [ErrorCode.EXAM.IMAGE_INVALID]: 'Ảnh minh họa không hợp lệ hoặc không rõ nét. Vui lòng kiểm tra lại.',
    [ErrorCode.EXAM.ANSWERS_EMPTY]: 'Danh sách câu trả lời không được để trống.',
    [ErrorCode.EXAM.ANSWER_FORMAT_INVALID]: 'Định dạng dữ liệu câu trả lời không hợp lệ.',
    [ErrorCode.EXAM.NAME_REQUIRED]: 'Tên đề thi không được để trống.',
    [ErrorCode.EXAM.NAME_TOO_LONG]: 'Tên đề thi không được vượt quá 100 ký tự.',
    [ErrorCode.EXAM.INVALID_MATRIX_ID]: 'Mã ma trận đề thi không tồn tại hoặc không đúng định dạng.',
    [ErrorCode.EXAM.USER_ID_REQUIRED]: 'Mã người dùng tạo đề là bắt buộc.',
    [ErrorCode.EXAM.LICENSE_CATEGORY_REQUIRED]: 'Hạng bằng lái của đề thi không được để trống.',
    [ErrorCode.EXAM.QUESTIONS_EMPTY]: 'Đề thi phải có ít nhất một câu hỏi.',
    [ErrorCode.EXAM.INVALID_DURATION]: 'Thời gian làm bài phải lớn hơn 0 phút.',
    [ErrorCode.EXAM.PASSING_SCORE_TOO_HIGH]: 'Điểm đạt không được lớn hơn tổng số câu hỏi của đề.',
    [ErrorCode.EXAM.MIN_CRITICAL_INVALID]: 'Số lượng câu hỏi điểm liệt không hợp lệ.',
    [ErrorCode.EXAM.INVALID_TIME_RANGE]: 'Thời gian kết thúc phải sau thời gian bắt đầu.',
    [ErrorCode.EXAM.TOTAL_QUESTIONS_INVALID]: 'Tổng số câu hỏi phải lớn hơn 0.',
    [ErrorCode.EXAM.NAME_ALREADY_EXISTS]: 'Tên đề thi này đã tồn tại, vui lòng nhập tên khác.',
    
    // --- Nhóm 2xx: Business/Pool (Lỗi kho dữ liệu & Nghiệp vụ) ---
    [ErrorCode.EXAM.INSUFFICIENT_POOL_QUESTIONS]: 'Tổng kho câu hỏi không đủ số lượng để đáp ứng cấu trúc đề thi.',
    [ErrorCode.EXAM.INSUFFICIENT_CHAPTER_QUESTIONS]: 'Số lượng câu hỏi trong chương không đủ để tạo đề theo yêu cầu.',
    [ErrorCode.EXAM.INSUFFICIENT_CRITICAL_QUESTIONS]: 'Kho dữ liệu không đủ số lượng câu hỏi điểm liệt để tạo đề.',
    [ErrorCode.EXAM.QUESTION_DATA_INVALID]: 'Dữ liệu câu hỏi trong hệ thống bị lỗi (thiếu đáp án hoặc nội dung).',

    // --- Nhóm 4xx: State/Flow (Lỗi trạng thái & Luồng thi) ---
    [ErrorCode.EXAM.NOT_FOUND]: 'Thông tin bài thi không tồn tại trên hệ thống.',
    [ErrorCode.EXAM.ALREADY_SUBMITTED]: 'Bài thi này đã được nộp và ghi nhận kết quả trước đó.',
    [ErrorCode.EXAM.EXPIRED]: 'Đã hết thời gian làm bài. Thao tác nộp bài không còn hiệu lực.',

    // --- Nhóm 5xx: Infrastructure/AI (Lỗi hệ thống & AI) ---
    [ErrorCode.EXAM.AI_PROCESSING_ERROR]: 'Hệ thống AI gặp sự cố trong quá trình xử lý dữ liệu. Vui lòng thử lại sau.',

    // === FILE & UPLOAD (FILE) ===
    [ErrorCode.FILE.UPLOAD_FAILED]: 'Tải tệp lên thất bại, vui lòng kiểm tra kết nối.',
    [ErrorCode.FILE.TOO_LARGE]: 'Kích thước tệp quá lớn, vui lòng chọn tệp nhẹ hơn.',
    [ErrorCode.FILE.INVALID_TYPE]: 'Định dạng tệp không hỗ trợ (Chỉ nhận .jpg, .png, .jpeg).',
    [ErrorCode.FILE.NOT_FOUND]: 'Tệp tin yêu cầu không tồn tại hoặc đã bị xóa khỏi hệ thống.',

    // === DATA VALIDATION (VAL) ===
    // --- VALIDATION (0xx: General) ---
    [ErrorCode.VALIDATION.REQUIRED]: 'Trường dữ liệu này là bắt buộc.',
    [ErrorCode.VALIDATION.ID_REQUIRED]: 'ID định danh không được để trống.',
    [ErrorCode.VALIDATION.NAME_REQUIRED]: 'Vui lòng nhập tên.',
    [ErrorCode.VALIDATION.DESCRIPTION_REQUIRED]: 'Vui lòng nhập mô tả.',
    [ErrorCode.VALIDATION.INVALID_FORMAT]: 'Dữ liệu không đúng định dạng yêu cầu.',
    [ErrorCode.VALIDATION.INVALID_LENGTH]: 'Độ dài dữ liệu không hợp lệ.',
    [ErrorCode.VALIDATION.CODE_REQUIRED]: 'Mã (Code) không được để trống.',
    [ErrorCode.VALIDATION.INVALID_NUMBER]: 'Định dạng số không hợp lệ.',
    [ErrorCode.VALIDATION.INVALID_INPUT]: 'Dữ liệu đầu vào không hợp lệ, vui lòng kiểm tra lại.',

    // --- VALIDATION (1xx: Identity) ---
    [ErrorCode.VALIDATION.EMAIL_INVALID]: 'Địa chỉ email không hợp lệ (ví dụ: name@example.com).',
    [ErrorCode.VALIDATION.NAME_INVALID_LENGTH]: 'Tên có độ dài không phù hợp.',
    [ErrorCode.VALIDATION.NAME_FORMAT_INVALID]: 'Tên chứa ký tự không hợp lệ.',
    [ErrorCode.VALIDATION.DESCRIPTION_TOO_LONG]: 'Mô tả quá dài, vui lòng rút gọn.',
    [ErrorCode.VALIDATION.ID_INVALID_UUID]: 'Mã định danh (ID) không đúng định dạng chuỗi chuẩn (UUID).',
    
    // --- VALIDATION (2xx: Security) ---
    [ErrorCode.VALIDATION.PASSWORD_INVALID]: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ và số.',
    [ErrorCode.VALIDATION.PASSWORD_CONFIRM_MISMATCH]: 'Mật khẩu xác nhận không trùng khớp.',
    [ErrorCode.VALIDATION.PASSWORD_MUST_BE_DIFFERENT]: 'Mật khẩu mới không được trùng với mật khẩu cũ.',
    [ErrorCode.VALIDATION.PASSWORD_TOO_SHORT]: 'Mật khẩu quá ngắn, vui lòng nhập tối thiểu 8 ký tự.',
    [ErrorCode.VALIDATION.REFRESH_TOKEN_REQUIRED]: 'Phiên làm việc đã hết hạn hoặc thiếu mã làm mới (Refresh Token).',
    [ErrorCode.VALIDATION.REFRESH_TOKEN_INVALID]: 'Mã làm mới không hợp lệ hoặc không đúng định dạng.',

    // --- VALIDATION (3xx: Specific) ---
    [ErrorCode.VALIDATION.AGE_MUST_BE_NUMBER]: 'Độ tuổi phải là một con số nguyên.',
    [ErrorCode.VALIDATION.AGE_INVALID]: 'Độ tuổi không hợp lệ (phải từ 18 tuổi trở lên).',
    [ErrorCode.VALIDATION.INVALID_PERCENTAGE]: 'Tỷ lệ phần trăm không hợp lệ (giá trị phải nằm trong khoảng từ 0 đến 100).',

    // --- VALIDATION (4xx: Exam & Training) ---
    [ErrorCode.VALIDATION.LICENSE_CATEGORY_REQUIRED]: 'Vui lòng chọn hạng bằng lái (A1, B2, ...).',
    [ErrorCode.VALIDATION.EXAM_QUESTIONS_EMPTY]: 'Danh sách câu hỏi không được để trống.',
    [ErrorCode.VALIDATION.INVALID_DURATION]: 'Thời gian làm bài phải là số nguyên dương.',
    [ErrorCode.VALIDATION.PASSING_SCORE_TOO_HIGH]: 'Điểm đạt không được vượt quá tổng số câu hỏi của đề thi.',
    [ErrorCode.VALIDATION.MATRIX_ID_REQUIRED]: 'Không tìm thấy mã ma trận cấu hình đề thi.',
    [ErrorCode.VALIDATION.USER_ID_REQUIRED]: 'Thông tin thí sinh (User ID) không hợp lệ.',
    [ErrorCode.VALIDATION.MIN_CRITICAL_INVALID]: 'Số câu điểm liệt yêu cầu không được nhỏ hơn 0 hoặc vượt quá tổng số câu.',
    [ErrorCode.VALIDATION.RESTORE_FAILED_DUPLICATE]: 'Không thể khôi phục vì dữ liệu này đã tồn tại trong hệ thống.',

    // --- LICENSE ---
    [ErrorCode.LICENSE.ALREADY_EXISTS]: 'Tên hạng bằng lái này đã tồn tại trong hệ thống.',
    [ErrorCode.LICENSE.NOT_FOUND]: 'Không tìm thấy hạng bằng lái yêu cầu.',
    [ErrorCode.LICENSE.IS_IN_USE]: 'Không thể xóa: Đang có câu hỏi hoặc đề thi thuộc hạng bằng này.',
    [ErrorCode.LICENSE.NAME_ALREADY_EXISTS]: 'Tên hạng bằng lái này đã tồn tại trong hệ thống.',
    [ErrorCode.LICENSE.NAME_REQUIRED]: 'Tên hạng giấy phép lái xe không được để trống.',
    [ErrorCode.LICENSE.NAME_INVALID_LENGTH]: 'Tên hạng bằng phải có độ dài từ 1 đến 10 ký tự.',
    [ErrorCode.LICENSE.NAME_FORMAT_INVALID]: 'Tên hạng bằng không đúng định dạng quy định.',
    [ErrorCode.LICENSE.AGE_REQUIRED]: 'Độ tuổi tối thiểu phải là một con số hợp lệ.',
    [ErrorCode.LICENSE.AGE_INVALID]: 'Độ tuổi tối thiểu để cấp bằng lái xe phải từ 18 tuổi trở lên.',
    [ErrorCode.LICENSE.DESCRIPTION_REQUIRED]: 'Mô tả hạng bằng không được để trống.',
    [ErrorCode.LICENSE.DESCRIPTION_TOO_LONG]: 'Mô tả không được vượt quá 500 ký tự.',
    [ErrorCode.LICENSE.INVALID_ORDER]: 'Thứ tự sắp xếp không hợp lệ (phải lớn hơn hoặc bằng 0).',
    [ErrorCode.LICENSE.ID_REQUIRED]: 'Mã định danh (ID) hạng bằng là bắt buộc để cập nhật.',

    // === CHAPTER (CHƯƠNG LÝ THUYẾT) ===
    [ErrorCode.CHAPTER.NOT_FOUND]: 'Không tìm thấy chương lý thuyết yêu cầu.',
    [ErrorCode.CHAPTER.NAME_ALREADY_EXISTS]: 'Tên chương này đã tồn tại trong hệ thống.',
    [ErrorCode.CHAPTER.CODE_ALREADY_EXISTS]: 'Mã chương (Code) này đã được sử dụng.',
    [ErrorCode.CHAPTER.IS_IN_USE]: 'Không thể xóa chương này vì đang có dữ liệu liên quan.',
    [ErrorCode.CHAPTER.CREATE_FAILED]: 'Quá trình tạo mới chương lý thuyết thất bại.',
    [ErrorCode.CHAPTER.UPDATE_FAILED]: 'Cập nhật thông tin chương lý thuyết thất bại.',
    [ErrorCode.CHAPTER.INVALID_ORDER]: 'Thứ tự hiển thị của chương không hợp lệ.',
    [ErrorCode.CHAPTER.INVALID_DESCRIPTION]: 'Mô tả chương không được để trống hoặc chỉ chứa khoảng trắng.',
    [ErrorCode.CHAPTER.INVALID_CODE]: "Mã chương không hợp lệ. Chỉ chấp nhận chữ cái và chữ số, không bao gồm khoảng trắng hoặc ký tự đặc biệt.",
    [ErrorCode.CHAPTER.ID_REQUIRED]: 'Mã định danh (ID) chương là bắt buộc để cập nhật.',
    [ErrorCode.CHAPTER.NAME_REQUIRED]: 'Tên chương không được để trống.',
    [ErrorCode.CHAPTER.CODE_REQUIRED]: 'Mã chương không được để trống.',
    [ErrorCode.CHAPTER.DESCRIPTION_REQUIRED]: 'Mô tả chương không được để trống.',
    [ErrorCode.CHAPTER.DESCRIPTION_TOO_LONG]: 'Mô tả chương không được vượt quá 500 ký tự.',

    // --- QUESTION ---
    // --- 0xx: Validation ---
    [ErrorCode.QUESTION.CHAPTER_REQUIRED]: 'Mã chương học là bắt buộc.',
    [ErrorCode.QUESTION.CONTENT_INVALID]: 'Nội dung câu hỏi không hợp lệ hoặc quá ngắn.',
    [ErrorCode.QUESTION.LICENSE_REQUIRED]: 'Hạng bằng lái cho câu hỏi này là bắt buộc.',
    [ErrorCode.QUESTION.ANSWERS_INSUFFICIENT]: 'Mỗi câu hỏi phải có ít nhất 2 đáp án.',
    [ErrorCode.QUESTION.CORRECT_ANSWER_MISSING]: 'Câu hỏi phải có ít nhất một đáp án đúng.',
    [ErrorCode.QUESTION.IMAGE_URL_INVALID]: 'Đường dẫn hình ảnh minh họa không hợp lệ.',

    // --- 1xx: Format & Logic ---
    [ErrorCode.QUESTION.ID_REQUIRED]: 'Yêu cầu mã định danh câu hỏi.',
    [ErrorCode.QUESTION.INVALID_FORMAT]: 'Dữ liệu câu hỏi không đúng định dạng quy định.',
    [ErrorCode.QUESTION.MULTIPLE_CORRECT_ANSWERS]: 'Câu hỏi này chỉ được phép có tối đa một đáp án đúng.',
    [ErrorCode.QUESTION.ANSWER_CONTENT_REQUIRED]: 'Nội dung của các đáp án không được để trống.',
    [ErrorCode.QUESTION.EXPLANATION_TOO_LONG]: 'Phần giải thích đáp án vượt quá độ dài cho phép.',
    [ErrorCode.QUESTION.LICENSE_ID_INVALID]: 'Mã hạng bằng lái không tồn tại trong hệ thống.',
    [ErrorCode.QUESTION.DIFFICULTY_INVALID]: 'Mức độ khó của câu hỏi không hợp lệ.',
    [ErrorCode.QUESTION.INDEX_INVALID]: 'Số thứ tự hiển thị của câu hỏi không hợp lệ.',
    [ErrorCode.QUESTION.STATUS_INVALID]: 'Trạng thái hoạt động của câu hỏi không hợp lệ.',
    [ErrorCode.QUESTION.IS_CRITICAL_INVALID]: 'Giá trị đánh dấu câu hỏi điểm liệt phải là kiểu đúng/sai.',

    // --- 4xx: Data Lifecycle ---
    [ErrorCode.QUESTION.NOT_FOUND]: 'Không tìm thấy câu hỏi yêu cầu.',
    [ErrorCode.QUESTION.EMPTY_BANK]: 'Ngân hàng câu hỏi cho hạng bằng này hiện đang trống.',
    [ErrorCode.QUESTION.INCOMPLETE_DATA_SET]: 'Số lượng câu hỏi không đủ để khởi tạo bộ đề theo cấu trúc ma trận.',
    [ErrorCode.QUESTION.ALREADY_EXISTS]: 'Nội dung câu hỏi này đã tồn tại trong hệ thống.',
    [ErrorCode.QUESTION.DELETE_CRITICAL_RESTRICTED]: 'Không thể xóa câu hỏi này do ràng buộc quy định nghiệp vụ.',

    // --- 5xx: System ---
    [ErrorCode.QUESTION.ANSWERS_SYNC_FAILED]: 'Lỗi đồng bộ dữ liệu đáp án, vui lòng kiểm tra lại hệ thống.',

    // IMPORT
    [ErrorCode.IMPORT.JOB_NOT_FOUND]: 'Không tìm thấy phiên làm việc (Import Job). Có thể phiên đã hết hạn.',
    [ErrorCode.IMPORT.JOB_INVALID_STATUS]: 'Trạng thái của phiên làm việc không hợp lệ để thực hiện thao tác này.',
    [ErrorCode.IMPORT.INVALID_CHUNK_INDEX]: 'Thứ tự mảnh dữ liệu (chunk index) không đúng hoặc bị trùng lặp.',
    [ErrorCode.IMPORT.EXTRACT_FAILED]: 'Thứ tự mảnh dữ liệu (chunk index) không đúng hoặc bị trùng lặp.',
    [ErrorCode.IMPORT.FILE_MISSING]: 'Không tìm thấy tập tin yêu cầu hoặc tập tin đã bị xóa khỏi hệ thống.',
    [ErrorCode.IMPORT.CHUNK_SIZE_EXCEEDED]: 'Kích thước của mảnh dữ liệu (chunk) vượt quá giới hạn cho phép của hệ thống.',
    [ErrorCode.IMPORT.SESSION_EXPIRED]: 'Phiên nhập liệu đã hết hạn do quá thời gian quy định. Vui lòng khởi tạo lại quy trình.',
    [ErrorCode.IMPORT.FILE_NAME_REQUIRED]: 'Tên tệp tin không được để trống.',
    [ErrorCode.IMPORT.INVALID_TOTAL_SIZE]: 'Tổng kích thước tệp tin phải lớn hơn 0.',
    [ErrorCode.IMPORT.INVALID_TOTAL_CHUNKS]: 'Tổng số mảnh (chunks) phải lớn hơn 0.',
    [ErrorCode.IMPORT.JOB_ID_REQUIRED]: 'Mã công việc (Job ID) không được để trống.',

    // --- MATRIX MESSAGES ---
    [ErrorCode.MATRIX.NAME_REQUIRED]: 'Tên ma trận đề thi không được để trống.',
    [ErrorCode.MATRIX.NAME_TOO_LONG]: 'Tên ma trận đề thi không được vượt quá 100 ký tự.',
    [ErrorCode.MATRIX.NO_DETAILS]: 'Cấu trúc ma trận phải có ít nhất một thông số chi tiết.',
    [ErrorCode.MATRIX.INVALID_PERCENTAGE]: 'Tổng tỉ lệ câu hỏi trong ma trận phải bằng 100%.',
    [ErrorCode.MATRIX.CHAPTER_PERCENTAGE_OUT_OF_RANGE]: 'Tỉ lệ phần trăm của mỗi chương phải lớn hơn 0% và không vượt quá 100%.',
    [ErrorCode.MATRIX.INVALID_PASSING_SCORE]: 'Điểm đạt yêu cầu không được lớn hơn tổng số câu hỏi.',
    [ErrorCode.MATRIX.DUPLICATE_CHAPTER]: 'Một chương không được xuất hiện hai lần trong cùng một ma trận.',
    [ErrorCode.MATRIX.NOT_FOUND]: 'Không tìm thấy thông tin ma trận đề thi này.',
    [ErrorCode.MATRIX.RESTORE_FAILED_DUPLICATE]: 'Không thể khôi phục vì tên ma trận này đã tồn tại trong hệ thống.',
    [ErrorCode.MATRIX.INVALID_DURATION]: 'Thời lượng làm bài phải lớn hơn 0 phút.',
    [ErrorCode.MATRIX.INVALID_TOTAL_QUESTIONS]: 'Tổng số câu hỏi của ma trận phải lớn hơn 0.',
    [ErrorCode.MATRIX.CHAPTER_ID_REQUIRED]: 'ID chương học trong danh sách chi tiết không được để trống.',
    [ErrorCode.MATRIX.LICENSE_CATEGORY_REQUIRED]: 'Hạng bằng lái cho ma trận là bắt buộc.',
    [ErrorCode.MATRIX.PASSING_SCORE_TOO_HIGH]: 'Điểm đạt không được lớn hơn tổng số câu hỏi.',
    [ErrorCode.MATRIX.MISSING_FIELDS]: 'Vui lòng điền đầy đủ các thông tin bắt buộc cho ma trận.',
    [ErrorCode.MATRIX.ID_REQUIRED]: 'Mã định danh (ID) ma trận là bắt buộc để cập nhật.',
    [ErrorCode.MATRIX.MIN_CRITICAL_INVALID]: 'Số lượng câu hỏi điểm liệt tối thiểu không hợp lệ.',
    [ErrorCode.MATRIX.IS_DEFAULT_INVALID]: 'Trạng thái mặc định (isDefault) phải là kiểu đúng/sai (boolean).',
    [ErrorCode.MATRIX.TOTAL_PERCENTAGE_NOT_100]: 'Tổng tỉ lệ phần trăm không bằng 100%',
    [ErrorCode.MATRIX.TOO_MANY_CHAPTERS_FOR_TOTAL]: 'Số lượng chương đã chọn vượt quá tổng số câu hỏi của đề thi. Vui lòng giảm bớt số chương hoặc tăng tổng số câu hỏi.',
    [ErrorCode.MATRIX.MIN_CRITICAL_REQUIRED]: 'Vui lòng nhập số lượng câu hỏi điểm liệt tối thiểu.',
    [ErrorCode.MATRIX.MIN_CRITICAL_NEGATIVE]: 'Số câu điểm liệt không thể là số âm.',
    [ErrorCode.MATRIX.MIN_CRITICAL_TOO_HIGH]: 'Số câu điểm liệt không được vượt quá tổng số câu hỏi của đề thi.',
    [ErrorCode.MATRIX.NAME_ALREADY_EXISTS]: 'Tên ma trận đã tồn tại trong hệ thống, vui lòng nhập tên khác.',

    // Nhóm EXCEL
    [ErrorCode.EXCEL.WORKSHEET_NOT_FOUND]: 'Không tìm thấy Worksheet yêu cầu trong file Excel.',
    [ErrorCode.EXCEL.INVALID_FORMAT]: 'Định dạng file Excel không hợp lệ.',
    [ErrorCode.EXCEL.EMPTY_FILE]: 'File Excel rỗng hoặc không có.',

    // Nhóm PROCESS 
    [ErrorCode.PROCESS.ALREADY_COMPLETED]: 'Yêu cầu này đã được xử lý hoặc hoàn thành trước đó.',

    // --- Nhóm MEDIA ---
    [ErrorCode.MEDIA.SOURCE_REQUIRED]: 'Nguồn dữ liệu phương tiện (đường dẫn hoặc tập tin) không được để trống.',
    [ErrorCode.MEDIA.INVALID_TYPE]: 'Định dạng tập tin không được hỗ trợ. Vui lòng kiểm tra lại.',
    [ErrorCode.MEDIA.FILE_TOO_LARGE]: 'Kích thước tập tin vượt quá giới hạn cho phép của hệ thống.',
    [ErrorCode.MEDIA.UPLOAD_FAILED]: 'Hệ thống gặp sự cố khi lưu trữ tập tin. Vui lòng thử lại sau.',

    [ErrorCode.EXAM_ATTEMPT.ID_REQUIRED]: 'Mã định danh lượt thi (ID) không được để trống.',
    [ErrorCode.EXAM_ATTEMPT.NOT_FOUND]: 'Không tìm thấy thông tin lượt thi.',
    [ErrorCode.EXAM_ATTEMPT.ALREADY_SUBMITTED]: 'Bài thi này đã được nộp trước đó.',
    [ErrorCode.EXAM_ATTEMPT.TIME_EXPIRED]: 'Thời gian làm bài đã hết, không thể thực hiện thao tác này.',
    [ErrorCode.EXAM_ATTEMPT.SCORE_INVALID]: 'Số điểm không hợp lệ với tổng số câu hỏi.',
    [ErrorCode.EXAM_ATTEMPT.RESULT_CONSISTENCY_ERROR]: 'Trạng thái Đạt/Trượt không khớp với điểm số hoặc logic câu điểm liệt.',
    [ErrorCode.EXAM_ATTEMPT.NOT_IN_PROGRESS]: 'Lượt thi hiện không trong trạng thái đang làm bài.',
    [ErrorCode.EXAM_ATTEMPT.UNAUTHORIZED_ACCESS]: 'Bạn không có quyền truy cập vào lượt thi này.',

    [ErrorCode.ACTIVE_SESSION.NOT_FOUND]: 'Phiên làm việc không tồn tại.',
    [ErrorCode.ACTIVE_SESSION.EXPIRED]: 'Phiên làm việc đã hết hạn, vui lòng đăng nhập lại.',
    [ErrorCode.ACTIVE_SESSION.REVOKED]: 'Phiên làm việc đã bị thu hồi hoặc bạn đã đăng xuất từ thiết bị khác.',
    [ErrorCode.ACTIVE_SESSION.MAX_SESSIONS_REACHED]: 'Số lượng thiết bị đăng nhập đã đạt giới hạn tối đa.',
    [ErrorCode.ACTIVE_SESSION.INVALID_TOKEN]: 'Mã xác thực phiên không hợp lệ.',
    [ErrorCode.ACTIVE_SESSION.DEVICE_MISMATCH]: 'Thông tin thiết bị không khớp với phiên hiện tại.',
    [ErrorCode.ACTIVE_SESSION.INVALID_EXPIRATION_TIME]: 'Thời gian hết hạn phải lớn hơn 0 phút.',

    // --- Nhóm CACHE (CSH) ---
    [ErrorCode.CACHE.NOT_INITIALIZED]: 'Dữ liệu hệ thống chưa sẵn sàng hoặc đang được khởi tạo.',
    [ErrorCode.CACHE.EMPTY_DATA]: 'Dữ liệu gốc từ máy chủ trống, không thể nạp bộ nhớ đệm.',
    [ErrorCode.CACHE.REFRESH_FAILED]: 'Làm mới dữ liệu bộ nhớ đệm thất bại, vui lòng kiểm tra kết nối.',
    [ErrorCode.CACHE.KEY_NOT_FOUND]: 'Thông tin yêu cầu không tồn tại trong bộ nhớ đệm của hệ thống.',

    [ErrorCode.MONGODB.CONNECTION_ERROR]: 'Không thể kết nối đến cơ sở dữ liệu.',
    [ErrorCode.MONGODB.NOT_INITIALIZED]: 'Hệ thống lưu trữ chưa được khởi tạo.',
    [ErrorCode.MONGODB.TRANSACTION_FAILED]: 'Tiến trình xử lý dữ liệu thất bại.',
    [ErrorCode.MONGODB.QUERY_TIMEOUT]: 'Truy vấn cơ sở dữ liệu quá thời gian quy định.',

    // --- SESSION ---
    [ErrorCode.SESSION.EXAM_ID_REQUIRED]: 'Mã đề thi không được để trống..',
    [ErrorCode.SESSION.INVALID_EXAM_ID]: 'Mã đề thi không hợp lệ, không thể bắt đầu phiên thi.',
    [ErrorCode.SESSION.INVALID_QUESTION_ID]: 'Câu hỏi không tồn tại trong phiên thi này.',
    [ErrorCode.SESSION.ANSWER_FORMAT_INVALID]: 'Định dạng đáp án đã chọn không hợp lệ.',
    [ErrorCode.SESSION.ANSWERS_REQUIRED]: 'Danh sách câu trả lời không được để trống.',
    [ErrorCode.SESSION.DUPLICATE_QUESTION]: 'Phát hiện câu hỏi bị lặp lại trong danh sách nộp bài.',
    [ErrorCode.SESSION.INVALID_ANSWER_VALUE]: 'Giá trị đáp án phải là số nguyên dương.',
    [ErrorCode.SESSION.INVALID_QUESTION_INDEX]: 'Vị trí câu hỏi hiện tại không hợp lệ.',
    [ErrorCode.SESSION.CLIENT_TIMESTAMP_REQUIRED]: 'Thời gian gửi yêu cầu không được để trống.',
    [ErrorCode.SESSION.SESSION_ID_REQUIRED]: 'Mã phiên làm việc (session_id) không được để trống.',
    [ErrorCode.SESSION.INVALID_TIME_SPENT]: 'Thời gian làm bài không hợp lệ.',
    [ErrorCode.SESSION.INVALID_TIME_REMAINING]: 'Thời gian còn lại không hợp lệ.',
    [ErrorCode.SESSION.INVALID_FINISHED_DATE]: 'Định dạng thời gian kết thúc không chính xác.',

    [ErrorCode.SESSION.NOT_FOUND]: 'Không tìm thấy thông tin phiên thi hiện tại.',
    [ErrorCode.SESSION.ALREADY_SUBMITTED]: 'Bài thi này đã được nộp trước đó, không thể thay đổi đáp án.',
    [ErrorCode.SESSION.EXPIRED]: 'Thời gian làm bài đã kết thúc.',

    // === EXAM HISTORY (EH) ===
    [ErrorCode.EXAM_HISTORY.INVALID_DURATION]: 'Thời gian làm bài không hợp lệ.',
    [ErrorCode.EXAM_HISTORY.INVALID_SCORE]: 'Điểm số bài thi không hợp lệ.',
    [ErrorCode.EXAM_HISTORY.USER_ID_REQUIRED]: 'Thông tin người dùng là bắt buộc.',
    [ErrorCode.EXAM_HISTORY.SNAPSHOT_ID_REQUIRED]: 'Thông tin bài làm (Snapshot) không được để trống.',
    [ErrorCode.EXAM_HISTORY.CATEGORY_INFO_REQUIRED]: 'Thông tin hạng bằng lái là bắt buộc.',
    [ErrorCode.EXAM_HISTORY.SCORE_CANNOT_BE_NEGATIVE]: 'Điểm số không được là số âm.',
    [ErrorCode.EXAM_HISTORY.RESULT_STATUS_REQUIRED]: 'Kết quả bài thi (Đạt/Trượt) phải được xác định.',
    [ErrorCode.EXAM_HISTORY.TOTAL_QUESTIONS_INVALID]: 'Tổng số câu hỏi của bài thi phải lớn hơn 0.',
    [ErrorCode.EXAM_HISTORY.SCORE_EXCEEDS_TOTAL]: 'Điểm số không thể lớn hơn tổng số câu hỏi.',
    [ErrorCode.EXAM_HISTORY.HISTORY_NOT_FOUND]: 'Không tìm thấy thông tin lịch sử bài thi yêu cầu.',

    // STATISTICS
    [ErrorCode.STATISTICS.NOT_FOUND]: 'Không tìm thấy dữ liệu thống kê yêu cầu.',
    [ErrorCode.STATISTICS.INVALID_TIME_RANGE]: 'Khoảng thời gian lọc thống kê không hợp lệ.',
    [ErrorCode.STATISTICS.DATA_EMPTY]: 'Hiện tại chưa có dữ liệu để thực hiện thống kê.',
    [ErrorCode.STATISTICS.CALCULATION_ERROR]: 'Có lỗi xảy ra trong quá trình tính toán dữ liệu thống kê.',

    // === USER STATISTICS (US) ===
    [ErrorCode.USER_STATS.INVALID_TOTAL_EXAMS]: 'Tổng số bài thi của người dùng không hợp lệ hoặc bị sai lệch.',
    [ErrorCode.USER_STATS.USER_NOT_FOUND]: 'Không tìm thấy thông tin người dùng để thực hiện thống kê.',
    [ErrorCode.USER_STATS.SYNC_FAILED]: 'Đồng bộ hóa dữ liệu thống kê người dùng thất bại.',

    // === QUESTION STATISTICS (QS) ===
    [ErrorCode.QUESTION_STATS.QUESTION_ID_REQUIRED]: 'Mã định danh câu hỏi (Question ID) là bắt buộc.',

    [ErrorCode.USER_TOPIC_STATS.TOPIC_ID_REQUIRED]: 'Mã chủ đề (Topic ID) là bắt buộc để truy vấn thống kê.',
    [ErrorCode.USER_TOPIC_STATS.INVALID_COMPLETION_RATE]: 'Tỉ lệ hoàn thành chủ đề phải nằm trong khoảng từ 0 đến 100.',
    [ErrorCode.USER_TOPIC_STATS.TOPIC_NOT_FOUND]: 'Không tìm thấy dữ liệu thống kê cho chủ đề yêu cầu.',
    [ErrorCode.USER_TOPIC_STATS.TOTAL_QUESTIONS_NEGATIVE]: 'Tổng số câu hỏi trong thống kê chủ đề không thể là số âm.',
    [ErrorCode.USER_TOPIC_STATS.WRONG_ANSWERS_EXCEEDS_TOTAL]: 'Số câu trả lời sai không được lớn hơn tổng số câu hỏi của chủ đề này.',
    [ErrorCode.USER_TOPIC_STATS.USER_ID_REQUIRED]: 'Định danh người dùng (User ID) là bắt buộc.',
    [ErrorCode.USER_TOPIC_STATS.RESULTS_REQUIRED]: 'Danh sách kết quả trả lời không được để trống.',
    [ErrorCode.USER_TOPIC_STATS.TOPIC_NAME_REQUIRED]: 'Tên chủ đề là bắt buộc trong dữ liệu thống kê.',
    [ErrorCode.USER_TOPIC_STATS.CORRECT_STATUS_REQUIRED]: 'Trạng thái câu trả lời (Đúng/Sai) không hợp lệ.',
};
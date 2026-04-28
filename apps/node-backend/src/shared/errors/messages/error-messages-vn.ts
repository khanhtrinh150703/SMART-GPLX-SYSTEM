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

    // === USER & PROFILE (USER) ===
    [ErrorCode.USER.NOT_FOUND]: 'Người dùng không tồn tại trên hệ thống.',
    [ErrorCode.USER.EMAIL_EXISTS]: 'Địa chỉ email này đã được sử dụng.',
    [ErrorCode.USER.USERNAME_EXISTS]: 'Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác.',
    [ErrorCode.USER.PHONE_EXISTS]: 'Số điện thoại này đã được đăng ký.',
    [ErrorCode.USER.REGISTER_FAILED]: 'Quá trình đăng ký gặp lỗi, vui lòng kiểm tra lại.',
    [ErrorCode.USER.UPDATE_FAILED]: 'Cập nhật thông tin không thành công.',
    [ErrorCode.AUTH.ROLES_NOT_INITIALIZED]: 'Vai trò người dùng chưa được khởi tạo hoặc không tồn tại trong hệ thống.',
    [ErrorCode.USER.NAME_REQUIRED]: 'Họ và tên không được để trống.',
    [ErrorCode.USER.NAME_TOO_SHORT]: 'Họ tên quá ngắn, vui lòng nhập tối thiểu 2 ký tự.',
    [ErrorCode.USER.NAME_TOO_LONG]: 'Họ tên quá dài, tối đa không quá 100 ký tự.',
    [ErrorCode.USER.NAME_INVALID]: 'Họ tên chứa ký tự không hợp lệ.',
    [ErrorCode.USER.STATUS_INVALID]: 'Trạng thái tài khoản không hợp lệ.',
    [ErrorCode.USER.ROLES_REQUIRED]: 'Người dùng phải được gán ít nhất một vai trò.',
    [ErrorCode.USER.INVALID_ROLE_ID]: 'Một hoặc nhiều vai trò được chọn không tồn tại trên hệ thống.',
    [ErrorCode.USER.AVATAR_TOO_LARGE]: 'Dung lượng ảnh đại diện không được vượt quá 5MB.',
    [ErrorCode.USER.AVATAR_INVALID_TYPE]: 'Định dạng tệp không hỗ trợ. Vui lòng sử dụng JPG, PNG hoặc WEBP.',

    // === SMART-GPLX (EXAM & AI) ===
    [ErrorCode.EXAM.IMAGE_INVALID]: 'Ảnh minh họa không hợp lệ hoặc không rõ nét. Vui lòng kiểm tra lại.',
    [ErrorCode.EXAM.ANSWERS_EMPTY]: 'Danh sách câu trả lời không được để trống.',
    [ErrorCode.EXAM.ANSWER_FORMAT_INVALID]: 'Định dạng dữ liệu câu trả lời không hợp lệ.',
    [ErrorCode.EXAM.NAME_REQUIRED]: 'Tên đề thi không được để trống.',
    [ErrorCode.EXAM.NAME_TOO_LONG]: 'Tên đề thi không được vượt quá 100 ký tự.',
    [ErrorCode.EXAM.INVALID_MATRIX_ID]: 'Mã ma trận đề thi không tồn tại hoặc không đúng định dạng.',

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

    // --- VALIDATION (1xx: Identity) ---
    [ErrorCode.VALIDATION.EMAIL_INVALID]: 'Địa chỉ email không hợp lệ (ví dụ: name@example.com).',
    [ErrorCode.VALIDATION.NAME_INVALID_LENGTH]: 'Tên có độ dài không phù hợp.',
    [ErrorCode.VALIDATION.NAME_FORMAT_INVALID]: 'Tên chứa ký tự không hợp lệ.',
    [ErrorCode.VALIDATION.DESCRIPTION_TOO_LONG]: 'Mô tả quá dài, vui lòng rút gọn.',

    // --- VALIDATION (2xx: Security) ---
    [ErrorCode.VALIDATION.PASSWORD_INVALID]: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ và số.',
    [ErrorCode.VALIDATION.PASSWORD_CONFIRM_MISMATCH]: 'Mật khẩu xác nhận không trùng khớp.',
    [ErrorCode.VALIDATION.PASSWORD_MUST_BE_DIFFERENT]: 'Mật khẩu mới không được trùng với mật khẩu cũ.',
    [ErrorCode.VALIDATION.REFRESH_TOKEN_REQUIRED]: 'Phiên làm việc đã hết hạn hoặc thiếu mã làm mới (Refresh Token).',
    [ErrorCode.VALIDATION.REFRESH_TOKEN_INVALID]: 'Mã làm mới không hợp lệ hoặc không đúng định dạng.',

    // --- VALIDATION (3xx: Specific) ---
    [ErrorCode.VALIDATION.AGE_MUST_BE_NUMBER]: 'Độ tuổi phải là một con số nguyên.',
    [ErrorCode.VALIDATION.AGE_INVALID]: 'Độ tuổi không hợp lệ (phải từ 18 tuổi trở lên).',
    
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

    // === CHAPTER (CHƯƠNG LÝ THUYẾT) ===
    [ErrorCode.CHAPTER.NOT_FOUND]: 'Không tìm thấy chương lý thuyết yêu cầu.',
    [ErrorCode.CHAPTER.NAME_ALREADY_EXISTS]: 'Tên chương này đã tồn tại trong hệ thống.',
    [ErrorCode.CHAPTER.CODE_ALREADY_EXISTS]: 'Mã chương (Code) này đã được sử dụng.',
    [ErrorCode.CHAPTER.HAS_RELATED_QUESTIONS]: 'Không thể xóa chương này vì đang có dữ liệu câu hỏi liên quan.',
    [ErrorCode.CHAPTER.CREATE_FAILED]: 'Quá trình tạo mới chương lý thuyết thất bại.',
    [ErrorCode.CHAPTER.UPDATE_FAILED]: 'Cập nhật thông tin chương lý thuyết thất bại.',
    [ErrorCode.CHAPTER.INVALID_ORDER]: 'Thứ tự hiển thị của chương không hợp lệ.',
    [ErrorCode.CHAPTER.INVALID_DESCRIPTION]: 'Mô tả chương không được để trống hoặc chỉ chứa khoảng trắng.',

    // --- QUESTION ---
    [ErrorCode.QUESTION.NOT_FOUND]: 'Câu hỏi không tồn tại trong hệ thống.',
    [ErrorCode.QUESTION.CHAPTER_REQUIRED]: 'ID chương lý thuyết không được để trống.',
    [ErrorCode.QUESTION.CONTENT_INVALID]: 'Nội dung câu hỏi phải có ít nhất 10 ký tự.',
    [ErrorCode.QUESTION.LICENSE_REQUIRED]: 'Vui lòng chọn ít nhất một hạng bằng lái.',
    [ErrorCode.QUESTION.ANSWERS_INSUFFICIENT]: 'Mỗi câu hỏi phải cung cấp tối thiểu 2 đáp án.',
    [ErrorCode.QUESTION.CORRECT_ANSWER_MISSING]: 'Câu hỏi bắt buộc phải có ít nhất một đáp án đúng.',
    [ErrorCode.QUESTION.IMAGE_URL_INVALID]: 'Đường dẫn hình ảnh minh họa không hợp lệ.',
    [ErrorCode.QUESTION.ALREADY_EXISTS]: 'Nội dung câu hỏi này đã tồn tại trong hệ thống.',
    [ErrorCode.QUESTION.CANNOT_DELETE_CRITICAL]: 'Không được phép xóa câu hỏi điểm liệt hệ thống.',
    [ErrorCode.QUESTION.ANSWERS_SYNC_ERROR]: 'Dữ liệu đáp án không đồng bộ. Vui lòng giữ lại truyền 2 đáp án hợp lệ.',

    // IMPORT
    [ErrorCode.IMPORT.JOB_NOT_FOUND]: 'Không tìm thấy phiên làm việc (Import Job). Có thể phiên đã hết hạn.',
    [ErrorCode.IMPORT.JOB_INVALID_STATUS]: 'Trạng thái của phiên làm việc không hợp lệ để thực hiện thao tác này.',
    [ErrorCode.IMPORT.INVALID_CHUNK_INDEX]: 'Thứ tự mảnh dữ liệu (chunk index) không đúng hoặc bị trùng lặp.',
    [ErrorCode.IMPORT.EXTRACT_FAILED]: 'Thứ tự mảnh dữ liệu (chunk index) không đúng hoặc bị trùng lặp.',
    [ErrorCode.IMPORT.FILE_MISSING]: 'Không tìm thấy tập tin yêu cầu hoặc tập tin đã bị xóa khỏi hệ thống.',
    [ErrorCode.IMPORT.CHUNK_SIZE_EXCEEDED]: 'Kích thước của mảnh dữ liệu (chunk) vượt quá giới hạn cho phép của hệ thống.',
    [ErrorCode.IMPORT.SESSION_EXPIRED]: 'Phiên nhập liệu đã hết hạn do quá thời gian quy định. Vui lòng khởi tạo lại quy trình.',

    // --- MATRIX MESSAGES ---
    [ErrorCode.MATRIX.NAME_REQUIRED]: 'Tên ma trận đề thi không được để trống.',
    [ErrorCode.MATRIX.NAME_TOO_LONG]: 'Tên ma trận đề thi không được vượt quá 100 ký tự.',
    [ErrorCode.MATRIX.NO_DETAILS]: 'Cấu trúc ma trận phải có ít nhất một thông số chi tiết.',
    [ErrorCode.MATRIX.INVALID_PERCENTAGE]: 'Tổng tỉ lệ câu hỏi trong ma trận phải bằng 100%.',
    [ErrorCode.MATRIX.INVALID_PASSING_SCORE]: 'Điểm đạt yêu cầu không được lớn hơn tổng số câu hỏi.',
    [ErrorCode.MATRIX.DUPLICATE_CHAPTER]: 'Một chương không được xuất hiện hai lần trong cùng một ma trận.',
    [ErrorCode.MATRIX.NOT_FOUND]: 'Không tìm thấy thông tin ma trận đề thi này.',
    [ErrorCode.MATRIX.RESTORE_FAILED_DUPLICATE]: 'Không thể khôi phục vì tên ma trận này đã tồn tại trong hệ thống.',
    [ErrorCode.MATRIX.INVALID_DURATION]: 'Thời lượng làm bài phải lớn hơn 0 phút.',
    [ErrorCode.MATRIX.INVALID_TOTAL_QUESTIONS]: 'Tổng số câu hỏi của ma trận phải lớn hơn 0.',
    [ErrorCode.MATRIX.CHAPTER_ID_REQUIRED]: 'ID chương học trong danh sách chi tiết không được để trống.',


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
};
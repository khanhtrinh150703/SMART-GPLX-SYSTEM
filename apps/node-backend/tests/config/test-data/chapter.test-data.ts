/** @description Payload mẫu cho Module Chương (Chapter) */
export const CHAPTER_PAYLOAD = {
    CREATE_VALID: {
        name: 'Quy định chung và quy tắc giao thông đường bộ',
        code: 'GPLX_CH1',
        description: 'Chương I bao gồm 180 câu hỏi cơ bản.',
        orderIndex: 1,
    },
    UPDATE_VALID: {
        name: 'Chương 1: Quy tắc GTĐB (Updated)',
        code: 'GPLX_CH1_V2',
        description: 'Mô tả chương đã được cập nhật.',
        orderIndex: 99,
    },
    DUPLICATE_NAME: {
        name: 'Quy định chung và quy tắc giao thông đường bộ',
        code: 'NEW_CODE_999',
        description: 'Mô tả chương đã được cập nhật.',
        orderIndex: 2
    },
    DUPLICATE_CODE: {
        name: 'Tên chương hoàn toàn mới',
        code: 'GPLX_CH1',
        description: 'Mô tả chương đã được cập nhật.',
        orderIndex: 3
    },
    INVALID_ORDER: {
        name: 'Chương lỗi thứ tự',
        code: 'ORDER_ERR',
        description: 'Mô tả chương đã được cập nhật.',
        orderIndex: -1
    },
    INVALID_DESCRIPTION: {
        name: 'Chương có mô tả rỗng',
        code: 'CH_DESC_ERR',
        description: '',
        orderIndex: 1
    },
    /** Tên chương bị trống hoặc chỉ chứa khoảng trắng */
    MISSING_NAME: {
        name: '   ',
        code: 'CH_ERR_01',
        description: 'Mô tả hợp lệ.',
        orderIndex: 1
    },

    MISSING_ID: {
        name: 'GHOST',
        code: 'GHOST',
        description: 'Thứ tự không được là số lẻ.',
        orderIndex: 1
    },
    
    /** Mã chương bị trống */
    MISSING_CODE: {
        name: 'Chương hợp lệ',
        code: '',
        description: 'Mô tả hợp lệ.',
        orderIndex: 2
    },

    /** Mô tả vượt quá giới hạn 500 ký tự */
    DESCRIPTION_TOO_LONG: {
        name: 'Chương lỗi mô tả dài',
        code: 'DESC_LONG_ERR',
        description: 'A'.repeat(501), // Tạo chuỗi 501 ký tự
        orderIndex: 3
    },

    /** Dữ liệu tối thiểu (Chỉ gồm các trường bắt buộc) */
    MINIMAL_VALID: {
        name: 'Chương tối giản',
        code: 'MIN_01',
        description: 'Mô tả ngắn.',
        orderIndex: 0
    },

    /** Lỗi gán orderIndex là số thập phân (nếu hệ thống yêu cầu số nguyên) */
    INVALID_ORDER_DECIMAL: {
        name: 'Chương lỗi số thập phân',
        code: 'ORDER_DEC',
        description: 'Thứ tự không được là số lẻ.',
        orderIndex: 1.5
    },


} as const;
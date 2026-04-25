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
        orderIndex: 2 
    },
    DUPLICATE_CODE: { 
        name: 'Tên chương hoàn toàn mới', 
        code: 'GPLX_CH1', 
        orderIndex: 3 
    },
    INVALID_ORDER: { 
        name: 'Chương lỗi thứ tự', 
        code: 'ORDER_ERR', 
        orderIndex: -1 
    },
    INVALID_DESCRIPTION: { 
        name: 'Chương có mô tả rỗng', 
        code: 'CH_DESC_ERR', 
        description: '', 
        orderIndex: 1 
    },
} as const;
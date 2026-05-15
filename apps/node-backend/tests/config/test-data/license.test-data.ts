/** @description Payload mẫu cho Module Hạng bằng lái (License) - Mở rộng cho Unit Test */
export const LICENSE_PAYLOAD = {
    // --- 1. Nhóm Hợp lệ (Success Cases) ---
    CREATE_VALID: {
        name: 'B2',
        description: 'Hạng bằng lái xe ô tô chở người đến 9 chỗ ngồi, có kinh doanh vận tải.',
        minAge: 18,
        orderIndex: 1,
        vehicleType: 'Ô tô chở người đến 9 chỗ; ô tô tải dưới 3.500kg.',
    },
    UPDATE_VALID: {
        name: 'AA1',
        description: 'Mô tả đã được chỉnh sửa chuẩn xác hơn và chi tiết hơn.',
        minAge: 18,
        orderIndex: 1,
    },

    // --- 2. Nhóm Lỗi Tên (Name Validation Cases) ---
    NAME_MISSING: {
        name: '',
        description: 'Thiếu tên hạng bằng.',
        minAge: 18,
        orderIndex: 1,
    },
    NAME_TOO_LONG: {
        name: 'B2_Sieu_Cap_Vip', // Quá 10 ký tự
        description: 'Tên hạng bằng vượt quá độ dài quy định.',
        minAge: 18,
        orderIndex: 1,
    },
    NAME_WRONG_FORMAT: {
        name: 'Hạng_B2', // Sai định dạng Regex (giả sử regex chỉ nhận A1, B2...)
        description: 'Tên chứa ký tự đặc biệt không cho phép.',
        minAge: 18,
        orderIndex: 1,
    },

    // --- 3. Nhóm Lỗi Độ tuổi (Age Validation Cases) ---
    AGE_MISSING: {
        name: 'C',
        description: 'Thiếu trường minAge.',
        minAge: null,
        orderIndex: 1,
    },
    AGE_NOT_A_NUMBER: {
        name: 'C',
        description: 'Độ tuổi truyền vào là chuỗi thay vì số.',
        minAge: '21',
        orderIndex: 1,
    },
    AGE_IS_NAN: {
        name: 'C',
        description: 'Độ tuổi truyền vào là NaN.',
        minAge: NaN,
        orderIndex: 1,
    },
    AGE_UNDER_18: {
        name: 'C',
        description: 'Độ tuổi tối thiểu không đủ 18.',
        minAge: 17,
        orderIndex: 1,
    },

    // --- 4. Nhóm Lỗi Mô tả & Thứ tự (Description & Order) ---
    DESCRIPTION_MISSING: {
        name: 'D',
        description: '', // Trống mô tả
        minAge: 21,
        orderIndex: 1,
    },
    DESCRIPTION_TOO_LONG: {
        name: 'D',
        description: 'A'.repeat(501), // Tạo chuỗi 501 ký tự
        minAge: 21,
        orderIndex: 1,

    },
    ORDER_INDEX_NEGATIVE: {
        name: 'E',
        description: 'Kiểm tra orderIndex âm.',
        minAge: 21,
        orderIndex: -5
    },

    // --- 5. Nhóm Lỗi Nghiệp vụ (Business Logic) ---
    DUPLICATE_NAME: {
        name: 'D1',
        description: 'Mô tả trùng lặp để kiểm tra logic validate trùng tên trong DB.',
        minAge: 18,
        orderIndex: 1,
        
    },
    // Lỗi thiếu ID (thường là do logic code ở Controller)
    MISSING_ID: {
        name: 'B2',
        description: 'Mô tả hợp lệ',
        minAge: 18,
        orderIndex: 1,
    },
    // Lỗi Regex định dạng (VD: không được chứa số lạ hoặc ký tự đặc biệt)
    INVALID_FORMAT: {
        name: 'B 2', // Chứa khoảng trắng
        description: 'Mô tả hợp lệ',
        orderIndex: 1,
        minAge: 18,
    },
    // Lỗi logic thứ tự
    NEGATIVE_ORDER: {
        name: 'B2',
        description: 'Mô tả hợp lệ',
        minAge: 18,
        orderIndex: -1
    }
} as const;
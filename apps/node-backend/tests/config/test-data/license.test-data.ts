/** @description Payload mẫu cho Module Hạng bằng lái (License) */
export const LICENSE_PAYLOAD = {
    CREATE_VALID: {
        name: 'B2',
        description: 'Hạng bằng lái xe ô tô chở người đến 9 chỗ ngồi, có kinh doanh vận tải.',
        minAge: 18,
        vehicleType: 'Ô tô chở người đến 9 chỗ; ô tô tải dưới 3.500kg.',
    },
    UPDATE_VALID: {
        name: 'B2',
        description: 'Mô tả đã được chỉnh sửa chuẩn xác hơn và chi tiết hơn.',
        minAge: 18,
    },
    DUPLICATE_NAME: { 
        name: 'B2', 
        description: 'Mô tả trùng lặp để kiểm tra logic validate.',
        minAge: 18,
    },
    INVALID_NAME: { 
        name: '', 
        description: 'Chương giả mạo hoặc dữ liệu không hợp lệ.', 
        minAge: 18 
    },
    INVALID_AGE: {
        name: 'C',
        description: 'Kiểm tra độ tuổi không hợp lệ.',
        minAge: 15, 
    },
} as const;
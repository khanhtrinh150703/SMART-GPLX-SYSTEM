export const permissions = [
    // 👤 Quản lý người dùng
    { name: 'users:read', description: 'Xem danh sách người dùng' },
    { name: 'users:manage', description: 'Thêm, sửa, khóa tài khoản người dùng' },
    { name: 'profile:manage', description: 'Cập nhật thông tin cá nhân của chính mình' },

    // 📚 Ngân hàng câu hỏi
    { name: 'questions:read', description: 'Xem ngân hàng câu hỏi' },
    { name: 'questions:write', description: 'Thêm/Sửa câu hỏi và đáp án' },
    { name: 'questions:import', description: 'Import câu hỏi từ file Excel' },
    { name: 'questions:delete', description: 'Xóa câu hỏi' },

    // 📖 Chương học & Mẹo thi (Tách Read để Student còn vào học được)
    { name: 'chapters:read', description: 'Xem nội dung bài học' },
    { name: 'chapters:manage', description: 'Quản lý (Thêm/Sửa/Xóa) chương học và mẹo thi' },

    // 🪪 Hạng bằng lái
    { name: 'licenses:read', description: 'Xem danh sách các hạng bằng lái' },
    { name: 'licenses:manage', description: 'Quản lý thông tin các hạng bằng (A1, B2, C...)' },

    // 📝 Đề thi & Kết quả
    { name: 'exams:manage', description: 'Tạo và cấu trúc bộ đề thi' },
    { name: 'exams:take', description: 'Thực hiện bài thi thử' },
    { name: 'results:read', description: 'Xem lịch sử và kết quả thi' },

    // 🔑 Quyền tối thượng
    { name: 'admin:all', description: 'Toàn quyền hệ thống (Bypass mọi kiểm tra)' },
];

export const roles = [
    { name: 'ADMIN', description: 'Quản trị viên hệ thống' },
    { name: 'INSTRUCTOR', description: 'Giảng viên/Người ra đề' },
    { name: 'STUDENT', description: 'Học viên/Thí sinh' },
];

export const adminUser = {
    username: 'admin',
    email: 'admin@smartgplx.com',
    password: 'AdminPassword123@',
    fullName: 'Quản trị viên hệ thống',
    phoneNumber: '0999999999',
};

export const testUser = {
    username: 'testuser',
    email: 'testuser@smartgplx.com',
    password: 'UserPassword123@',
    fullName: 'Người dùng thử nghiệm',
    phoneNumber: '0988888888',
};

export const testInstructor = {
    username: 'testinstructor',
    email: 'instructor@smartgplx.com',
    password: 'InstructorPassword123@',
    fullName: 'Giảng viên hướng dẫn',
    phoneNumber: '0977777777',
    role: 'INSTRUCTOR',
};

export const testUserTemp = {
    username: 'testusertemp',
    email: 'temp@smartgplx.com',
    password: 'TempPassword123@',
    fullName: 'Học viên dự phòng',
    phoneNumber: '0966666666',
};

export const licenses = [
    {
        name: 'A1',
        description: 'Mô tô 2 bánh có dung tích xi-lanh đến 125 cm3 hoặc công suất động cơ điện đến 11 kW.',
        minAge: 18
    },
    {
        name: 'A',
        description: 'Mô tô 2 bánh có dung tích xi-lanh trên 125 cm3 hoặc công suất điện trên 11 kW; các loại xe hạng A1.',
        minAge: 18
    },
    {
        name: 'B1',
        description: 'Mô tô 3 bánh; các loại xe quy định cho giấy phép lái xe hạng A1.',
        minAge: 18
    },
    {
        name: 'B',
        description: 'Ô tô chở người đến 08 chỗ; xe ô tô tải và ô tô chuyên dùng có khối lượng đến 3.500 kg; kéo rơ moóc đến 750 kg.',
        minAge: 18
    },
    {
        name: 'C1',
        description: 'Ô tô tải và chuyên dùng có khối lượng từ 3.500 kg đến 7.500 kg; kéo rơ moóc đến 750 kg; các loại xe hạng B.',
        minAge: 19 // Theo luật mới 2024 hạng C1 là 19 tuổi
    },
    {
        name: 'C',
        description: 'Ô tô tải và chuyên dùng có khối lượng trên 7.500 kg; kéo rơ moóc đến 750 kg; các loại xe hạng B và C1.',
        minAge: 21
    },
    {
        name: 'D1',
        description: 'Ô tô chở người từ trên 08 chỗ đến 16 chỗ; kéo rơ moóc đến 750 kg; các loại xe hạng B, C1, C.',
        minAge: 24
    },
    {
        name: 'D2',
        description: 'Ô tô chở người (kể cả xe buýt) từ trên 16 chỗ đến 29 chỗ; kéo rơ moóc đến 750 kg; các loại xe hạng B, C1, C, D1.',
        minAge: 24
    },
    {
        name: 'D',
        description: 'Ô tô chở người trên 29 chỗ; xe giường nằm; kéo rơ moóc đến 750 kg; các loại xe hạng B, C1, C, D1, D2.',
        minAge: 27
    },
    {
        name: 'BE',
        description: 'Các loại xe hạng B kéo rơ moóc có khối lượng trên 750 kg.',
        minAge: 18
    },
    {
        name: 'C1E',
        description: 'Các loại xe hạng C1 kéo rơ moóc có khối lượng trên 750 kg.',
        minAge: 19
    },
    {
        name: 'CE',
        description: 'Các loại xe hạng C kéo rơ moóc trên 750 kg; xe ô tô đầu kéo kéo sơ mi rơ moóc.',
        minAge: 24
    },
    {
        name: 'D1E',
        description: 'Các loại xe hạng D1 kéo rơ moóc có khối lượng trên 750 kg.',
        minAge: 24
    },
    {
        name: 'D2E',
        description: 'Các loại xe hạng D2 kéo rơ moóc có khối lượng trên 750 kg.',
        minAge: 24
    },
    {
        name: 'DE',
        description: 'Các loại xe hạng D kéo rơ moóc trên 750 kg; xe ô tô chở khách nối toa.',
        minAge: 27
    }
];

export const chapters = [
    {
        code: '1',
        name: 'Chương I: Quy định chung và quy tắc giao thông đường bộ',
        description: 'Gồm 180 câu (từ câu số 1 đến câu 180) về quy định chung và các quy tắc giao thông đường bộ.',
        orderIndex: 1
    },
    {
        code: '2',
        name: 'Chương II: Văn hóa giao thông, đạo đức người lái xe, kỹ năng PCCC và cứu hộ, cứu nạn',
        description: 'Gồm 25 câu (từ câu 181 đến câu 205) về văn hóa giao thông, đạo đức và kỹ năng phòng cháy, cứu hộ.',
        orderIndex: 2
    },
    {
        code: '3',
        name: 'Chương III: Kỹ thuật lái xe',
        description: 'Gồm 58 câu (từ câu 206 đến câu 263) hướng dẫn các phương pháp và kỹ năng điều khiển xe an toàn.',
        orderIndex: 3
    },
    {
        code: '4',
        name: 'Chương IV: Cấu tạo và sửa chữa',
        description: 'Gồm 37 câu (từ câu 264 đến câu 300) về cấu tạo cơ bản và cách khắc phục sự cố thông thường của xe ô tô.',
        orderIndex: 4
    },
    {
        code: '5',
        name: 'Chương V: Báo hiệu đường bộ',
        description: 'Gồm 185 câu (từ câu 301 đến câu 485) về hệ thống biển báo hiệu, vạch kẻ đường.',
        orderIndex: 5
    },
    {
        code: '6',
        name: 'Chương VI: Giải thế sa hình và kỹ năng xử lý tình huống giao thông',
        description: 'Gồm 115 câu (từ câu 486 đến câu 600) về quy tắc ưu tiên và xử lý tình huống tại các thế sa hình.',
        orderIndex: 6
    }
];
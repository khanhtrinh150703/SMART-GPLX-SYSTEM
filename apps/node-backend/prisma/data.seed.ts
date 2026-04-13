export const permissions = [
    { name: 'user:read', description: 'Xem thông tin người dùng' },
    { name: 'user:write', description: 'Sửa thông tin người dùng' },
    { name: 'user:delete', description: 'Xóa người dùng' },
    { name: 'exam:manage', description: 'Quản lý bộ đề thi (Admin/GV)' },
    { name: 'exam:take', description: 'Được phép làm bài thi (Học viên)' },
    { name: 'admin:all', description: 'Toàn quyền hệ thống' },
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
        name: 'Chương 1: Khái niệm và quy tắc giao thông đường bộ',
        description: 'Bao gồm các khái niệm cơ bản, quy tắc ưu tiên và các quy định khi tham gia giao thông (166 câu).',
        orderIndex: 1
    },
    {
        name: 'Chương 2: Nghiệp vụ vận tải',
        description: 'Quy định về hoạt động vận tải hàng hóa và hành khách bằng xe ô tô (26 câu).',
        orderIndex: 2
    },
    {
        name: 'Chương 3: Văn hóa giao thông và đạo đức người lái xe',
        description: 'Các chuẩn mực ứng xử, trách nhiệm và đạo đức của người điều khiển phương tiện (21 câu).',
        orderIndex: 3
    },
    {
        name: 'Chương 4: Kỹ thuật lái xe',
        description: 'Các phương pháp, kỹ năng điều khiển xe an toàn trong các điều kiện địa hình khác nhau (56 câu).',
        orderIndex: 4
    },
    {
        name: 'Chương 5: Cấu tạo và sửa chữa',
        description: 'Kiến thức cơ bản về các bộ phận của xe ô tô và cách khắc phục sự cố thông thường (35 câu).',
        orderIndex: 5
    },
    {
        name: 'Chương 6: Hệ thống biển báo hiệu đường bộ',
        description: 'Nhận biết và ý nghĩa của các nhóm biển báo: cấm, nguy hiểm, hiệu lệnh, chỉ dẫn (182 câu).',
        orderIndex: 6
    },
    {
        name: 'Chương 7: Giải các thế sa hình và kỹ năng xử lý tình huống',
        description: 'Quy tắc ưu tiên tại giao lộ và các tình huống thực tế khi lưu thông trên đường (114 câu).',
        orderIndex: 7
    }
];
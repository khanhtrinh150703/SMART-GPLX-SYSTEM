import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Đang bắt đầu quá trình Seed dữ liệu...');

    // 1. Định nghĩa danh sách Permissions (Nguyên liệu thô)
    const permissions = [
        { name: 'user:read', description: 'Xem thông tin người dùng' },
        { name: 'user:write', description: 'Sửa thông tin người dùng' },
        { name: 'user:delete', description: 'Xóa người dùng' },
        { name: 'exam:manage', description: 'Quản lý bộ đề thi (Admin/GV)' },
        { name: 'exam:take', description: 'Được phép làm bài thi (Học viên)' },
        { name: 'admin:all', description: 'Toàn quyền hệ thống' },
    ];

    console.log('- Đang nạp Permissions...');
    for (const p of permissions) {
        await prisma.permission.upsert({
            where: { name: p.name },
            update: {}, // Nếu tồn tại rồi thì không làm gì cả
            create: p,
        });
    }

    // 2. Định nghĩa Roles (Các chức danh)
    const roles = [
        { name: 'ADMIN', description: 'Quản trị viên hệ thống' },
        { name: 'INSTRUCTOR', description: 'Giảng viên/Người ra đề' },
        { name: 'STUDENT', description: 'Học viên/Thí sinh' },
    ];

    console.log('- Đang nạp Roles...');
    for (const r of roles) {
        await prisma.role.upsert({
            where: { name: r.name },
            update: {},
            create: r,
        });
    }

    // 3. Mapping: Gán Permission cho Role (RolePermission)
    console.log('- Đang thiết lập quyền cho từng Role...');

    // Lấy dữ liệu từ DB ra để lấy ID chính xác
    const allPerms = await prisma.permission.findMany();
    const allRoles = await prisma.role.findMany();

    const getPermId = (name: string) => allPerms.find((p) => p.name === name)!.id;
    const getRoleId = (name: string) => allRoles.find((r) => r.name === name)!.id;

    // Định nghĩa logic gán quyền
    const roleMapping = [
        // ADMIN có mọi quyền
        { roleId: getRoleId('ADMIN'), permissions: allPerms.map(p => p.id) },

        // INSTRUCTOR có quyền quản lý đề và xem user
        {
            roleId: getRoleId('INSTRUCTOR'),
            permissions: [getPermId('exam:manage'), getPermId('user:read'), getPermId('exam:take')]
        },

        // STUDENT chỉ có quyền làm bài
        {
            roleId: getRoleId('STUDENT'),
            permissions: [getPermId('exam:take')]
        },
    ];

    for (const mapping of roleMapping) {
        for (const pId of mapping.permissions) {
            await prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: mapping.roleId,
                        permissionId: pId,
                    },
                },
                update: {},
                create: {
                    roleId: mapping.roleId,
                    permissionId: pId,
                },
            });
        }
    }

    console.log('✅ Seed dữ liệu hoàn tất!');
}

main()
    .catch((e) => {
        console.error(e);
        // process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
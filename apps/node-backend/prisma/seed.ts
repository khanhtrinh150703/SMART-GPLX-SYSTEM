import { PrismaClient } from '@prisma/client';
import { chapters, licenses, permissions, roles } from './data.seed';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Đang bắt đầu quá trình Seed dữ liệu...');

    // 1. Định nghĩa danh sách Permissions (Nguyên liệu thô)


    console.log('- Đang nạp Permissions...');
    for (const p of permissions) {
        await prisma.permission.upsert({
            where: { name: p.name },
            update: {}, // Nếu tồn tại rồi thì không làm gì cả
            create: p,
        });
    }

    // 2. Định nghĩa Roles (Các chức danh)


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

    console.log('- Đang nạp danh mục Hạng bằng lái (Licenses)...');
    for (const l of licenses) {
        await prisma.licenseCategory.upsert({
            where: { name: l.name }, // Dùng name làm định danh duy nhất để tránh tạo trùng
            update: {
                description: l.description,
                minAge: l.minAge,
            }, // Nếu đổi mô tả hoặc tuổi tối thiểu thì nó sẽ cập nhật luôn
            create: l,
        });
    }

    console.log('- Đang nạp danh mục Chương (Chapters)...');
    for (const c of chapters) {
        await prisma.chapter.upsert({
            where: { name: c.name }, // Dùng name để tránh tạo trùng khi chạy lại lệnh seed
            update: {
                description: c.description,
                orderIndex: c.orderIndex,
            },
            create: c,
        }); 
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
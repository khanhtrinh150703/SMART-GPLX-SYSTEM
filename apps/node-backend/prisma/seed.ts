import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  chapters,
  licenses,
  permissions,
  roles,
  adminUser,
  testUser
} from './data.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang bắt đầu quá trình Seed dữ liệu...');

  // 1. Seed Permissions
  console.log('- Đang nạp Permissions...');
  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }

  // 2. Seed Roles
  console.log('- Đang nạp Roles...');
  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: r,
    });
  }

  // 3. Mapping: Gán Permission cho Role
  console.log('- Đang thiết lập quyền cho từng Role...');
  const allPerms = await prisma.permission.findMany();
  const allRoles = await prisma.role.findMany();

  const getPermId = (name: string) => allPerms.find((p) => p.name === name)!.id;
  const getRoleId = (name: string) => allRoles.find((r) => r.name === name)!.id;

  const roleMapping = [
    { roleId: getRoleId('ADMIN'), permissions: allPerms.map(p => p.id) },
    {
      roleId: getRoleId('INSTRUCTOR'),
      permissions: [getPermId('exam:manage'), getPermId('user:read'), getPermId('exam:take')]
    },
    {
      roleId: getRoleId('STUDENT'),
      permissions: [getPermId('exam:take')]
    },
  ];

  for (const mapping of roleMapping) {
    for (const pId of mapping.permissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: mapping.roleId, permissionId: pId } },
        update: {},
        create: { roleId: mapping.roleId, permissionId: pId },
      });
    }
  }

  // 4. LOGIC TẠO ADMIN (Để trực tiếp tại đây)
  console.log('- Đang cấu hình tài khoản Admin...');
  const saltRounds = 10;
  const hashedAdminPassword = await bcrypt.hash(adminUser.password, saltRounds);

  const user = await prisma.user.upsert({
    where: { email: adminUser.email },
    update: { passwordHash: hashedAdminPassword },
    create: {
      username: adminUser.username,
      email: adminUser.email,
      phoneNumber: adminUser.phoneNumber,
      passwordHash: hashedAdminPassword,
      fullName: adminUser.fullName,
      status: 'active',
    },
  });

  // Gán Role Admin cho User vừa tạo
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: getRoleId('ADMIN') } },
    update: {},
    create: { userId: user.id, roleId: getRoleId('ADMIN') },
  });

  // --- Cấu hình tài khoản Student (Học viên) ---
  console.log('- Đang cấu hình tài khoản Student...');
  const hashedUserPassword = await bcrypt.hash(testUser.password, saltRounds);

  const student = await prisma.user.upsert({
    where: { email: testUser.email },
    update: { passwordHash: hashedUserPassword },
    create: {
      username: testUser.username,
      email: testUser.email,
      phoneNumber: testUser.phoneNumber,
      passwordHash: hashedUserPassword,
      fullName: testUser.fullName,
      status: 'active',
    },
  });

  // Gán Role STUDENT cho User vừa tạo
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: student.id,
        roleId: getRoleId('STUDENT') // Giả định role key của bạn là 'STUDENT'
      }
    },
    update: {},
    create: {
      userId: student.id,
      roleId: getRoleId('STUDENT')
    },
  });

  console.log('✅ Đã nạp xong tài khoản Admin và Student!');

  // 5. Seed Licenses
  console.log('- Đang nạp Hạng bằng lái...');
  for (const l of licenses) {
    await prisma.licenseCategory.upsert({
      where: { name: l.name },
      update: { description: l.description, minAge: l.minAge },
      create: l,
    });
  }

  // 6. Seed Chapters
  console.log('- Đang nạp danh mục Chương...');
  for (const c of chapters) {
    await prisma.chapter.upsert({
      where: { name: c.name },
      update: { description: c.description, orderIndex: c.orderIndex },
      create: c,
    });
  }

  console.log('✅ Seed dữ liệu hoàn tất!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
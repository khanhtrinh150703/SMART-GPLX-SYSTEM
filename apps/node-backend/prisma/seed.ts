import { PrismaClient, Role, User, Permission } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  chapters,
  licenses,
  permissions,
  roles,
  adminUser,
  testUser,
  testInstructor,
  testUserTemp
} from './data.seed';

const prisma = new PrismaClient();

/**
 * Interface cho dữ liệu User đầu vào từ data.seed
 */
interface ISeedUser {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

/**
 * Hàm hỗ trợ tạo/cập nhật User với Strict Typing
 */
async function upsertUser(userData: ISeedUser, saltRounds: number): Promise<User> {
  const passwordHash = await bcrypt.hash(userData.password, saltRounds);
  return await prisma.user.upsert({
    where: { email: userData.email },
    update: { passwordHash },
    create: {
      username: userData.username,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      passwordHash: passwordHash,
      fullName: userData.fullName,
      status: 'active',
    },
  });
}

/**
 * Hàm hỗ trợ gán nhiều Role cho một User (Sử dụng Type từ Prisma)
 */
async function assignRolesToUser(userId: string, roleNames: string[], allRoles: Role[]): Promise<void> {
  for (const roleName of roleNames) {
    const role = allRoles.find((r: Role) => r.name === roleName);
    if (role) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId, roleId: role.id } },
        update: {},
        create: { userId, roleId: role.id },
      });
    }
  }
}

async function main(): Promise<void> {
  console.log('🌱 --- BẮT ĐẦU QUÁ TRÌNH SEED DỮ LIỆU ---');
  const saltRounds = 10;

  // 1. Nạp Permissions & Roles
  console.log('📦 1. Đang nạp danh mục hệ thống (Permissions & Roles)...');
  for (const p of permissions) {
    await prisma.permission.upsert({ where: { name: p.name }, update: {}, create: p });
  }
  for (const r of roles) {
    await prisma.role.upsert({ where: { name: r.name }, update: {}, create: r });
  }

  const allPerms: Permission[] = await prisma.permission.findMany();
  const allRoles: Role[] = await prisma.role.findMany();

  // 2. Mapping Role - Permission
  console.log('🔗 2. Đang thiết lập ma trận quyền hạn (RBAC)...');
  const studentPerms: string[] = ['exams:take', 'profile:manage', 'results:read'];
  const instructorPerms: string[] = [
    ...studentPerms,
    'chapters:read', 'licenses:read', 'questions:read', 'questions:write',
    'questions:import', 'questions:delete', 'chapters:manage', 'licenses:manage', 'exams:manage',
  ];

  const roleMapping = [
    { name: 'ADMIN', perms: allPerms.map((p: Permission) => p.name) },
    { name: 'INSTRUCTOR', perms: instructorPerms },
    { name: 'STUDENT', perms: studentPerms },
  ];

  for (const mapping of roleMapping) {
    const role = allRoles.find((r: Role) => r.name === mapping.name);
    if (!role) continue;

    for (const permName of mapping.perms) {
      const perm = allPerms.find((p: Permission) => p.name === permName);
      if (!perm) continue;

      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
    }
  }

  // 3. Nạp Users & Gán Roles
  console.log('👤 3. Đang khởi tạo danh sách người dùng mẫu...');
  
  const adminDoc = await upsertUser(adminUser, saltRounds);
  await assignRolesToUser(adminDoc.id, ['ADMIN'], allRoles);

  const studentDoc = await upsertUser(testUser, saltRounds);
  await assignRolesToUser(studentDoc.id, ['STUDENT'], allRoles);

  const instructorDoc = await upsertUser(testInstructor, saltRounds);
  await assignRolesToUser(instructorDoc.id, ['INSTRUCTOR'], allRoles);

  const tempUserDoc = await upsertUser(testUserTemp, saltRounds);
  await assignRolesToUser(tempUserDoc.id, ['STUDENT', 'INSTRUCTOR'], allRoles);

  // 4. Nạp Dữ liệu nghiệp vụ
  console.log('📚 4. Đang nạp dữ liệu nghiệp vụ (Licenses & Chapters)...');
  for (const l of licenses) {
    await prisma.licenseCategory.upsert({
      where: { name: l.name },
      update: { description: l.description, minAge: l.minAge },
      create: l,
    });
  }
  for (const c of chapters) {
    await prisma.chapter.upsert({
      where: { name: c.name },
      update: { description: c.description, orderIndex: c.orderIndex },
      create: c,
    });
  }

  console.log('✨ --- NẠP DỮ LIỆU SEED THÀNH CÔNG ---');
}

main()
  .catch((e: Error) => {
    console.error('❌ Lỗi Seed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
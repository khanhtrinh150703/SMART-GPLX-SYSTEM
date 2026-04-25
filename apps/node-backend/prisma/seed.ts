import { PrismaClient, Role, Permission } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as SEED from './data.seed';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 --- BẮT ĐẦU QUÁ TRÌNH SEED DỮ LIỆU ---');
  const saltRounds = 10;

  // 1. Nạp Permissions & Roles
  console.log('📦 1. Đang nạp danh mục hệ thống (Permissions & Roles)...');

  for (const p of SEED.permissions) {
    await prisma.permission.upsert({
      where: { name: p.name },
      update: { description: p.description },
      create: p
    });
  }

  for (const r of SEED.roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: {
        name: r.name,
        description: r.description,
      },
    });
  }
  const allPerms: Permission[] = await prisma.permission.findMany();
  const allRoles: Role[] = await prisma.role.findMany();

  // 2. Mapping Role - Permission (RBAC Matrix)
  console.log('🔗 2. Đang thiết lập ma trận quyền hạn (PBAC)...');
  const studentPerms = ['exams:take', 'profile:manage', 'results:read'];
  const instructorPerms = [
    ...studentPerms,
    'questions:read', 'questions:write', 'questions:import', 'questions:delete',
    'chapters:manage', 'licenses:manage', 'exams:manage', 'matrices:read', 'matrices:manage'
  ];

  const roleMapping = [
    { name: 'ADMIN', perms: allPerms.map(p => p.name) },
    { name: 'INSTRUCTOR', perms: instructorPerms },
    { name: 'STUDENT', perms: studentPerms },
  ];

  for (const mapping of roleMapping) {
    const role = allRoles.find(r => r.name === mapping.name);
    if (!role) continue;

    for (const permName of mapping.perms) {
      const perm = allPerms.find(p => p.name === permName);
      if (!perm) continue;

      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
    }
  }

  // 3. Nạp Users & Gán Roles (Xử lý mảng users mới)
  console.log('👤 3. Đang khởi tạo danh sách người dùng mẫu...');
  for (const u of SEED.users) {
    const passwordHash = await bcrypt.hash(u.password, saltRounds);

    // Upsert User cơ bản
    const userDoc = await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash },
      create: {
        username: u.username,
        email: u.email,
        phoneNumber: u.phoneNumber,
        passwordHash: passwordHash,
        fullName: u.fullName,
        status: 'active',
      },
    });

    // Gán danh sách Roles (Multi-role)
    for (const roleName of u.roleNames) {
      const role = allRoles.find(r => r.name === roleName);
      if (role) {
        await prisma.userRole.upsert({
          where: { userId_roleId: { userId: userDoc.id, roleId: role.id } },
          update: {},
          create: { userId: userDoc.id, roleId: role.id },
        });
      }
    }
  }

  // 4. Nạp Dữ liệu nghiệp vụ cơ bản
  console.log('📚 4. Đang nạp danh mục Hạng bằng & Chương học...');
  for (const l of SEED.licenses) {
    await prisma.licenseCategory.upsert({
      where: { name: l.name },
      update: { description: l.description, minAge: l.minAge },
      create: l,
    });
  }
  for (const c of SEED.chapters) {
    await prisma.chapter.upsert({
      where: { code: c.code },
      update: { name: c.name, description: c.description, orderIndex: c.orderIndex },
      create: c,
    });
  }

  // 5. Nạp Ma trận đề thi (Aggregate Root)
  console.log('📑 5. Đang nạp Ma trận đề thi ...');
  for (const m of SEED.examMatrices) {
    const license = await prisma.licenseCategory.findUnique({ where: { name: m.licenseName } });
    if (!license) continue;

    const existingMatrix = await prisma.examMatrix.findFirst({
      where: { name: m.name, licenseCategoryId: license.id }
    });

    // Clean up details cũ để nạp mới hoàn toàn
    if (existingMatrix) {
      await prisma.examMatrixDetail.deleteMany({ where: { examMatrixId: existingMatrix.id } });
    }

    await prisma.examMatrix.upsert({
      where: { id: existingMatrix?.id || '00000000-0000-0000-0000-000000000000' }, // ID giả định nếu ko có
      update: {
        totalQuestions: m.totalQuestions,
        passingScore: m.passingScore,
        durationMinutes: m.durationMinutes,
        details: {
          create: await Promise.all(m.details.map(async (d) => {
            const ch = await prisma.chapter.findUnique({ where: { code: d.chapterCode } });
            return { chapterId: ch!.id, percentage: d.percentage };
          }))
        }
      },
      create: {
        name: m.name,
        licenseCategoryId: license.id,
        totalQuestions: m.totalQuestions,
        passingScore: m.passingScore,
        durationMinutes: m.durationMinutes,
        minCriticalQuestions: m.minCriticalQuestions,
        isDefault: m.isDefault,
        createdAt: new Date(),
        updatedAt: new Date(),
        details: {
          create: await Promise.all(m.details.map(async (d) => {
            const ch = await prisma.chapter.findUnique({ where: { code: d.chapterCode } });
            return { chapterId: ch!.id, percentage: d.percentage };
          }))
        }
      }
    });
  }

  console.log('✨ --- TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC ĐỒNG BỘ THÀNH CÔNG ---');
}

main()
  .catch((e: Error) => {
    console.error('❌ Lỗi Seed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
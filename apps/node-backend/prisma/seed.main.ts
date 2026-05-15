import { PrismaClient, Role, Permission } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as SEED from "./data";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("🌱 --- BẮT ĐẦU QUÁ TRÌNH SEED DỮ LIỆU ---");
  const saltRounds = 10;

  // 1. Nạp Permissions & Roles
  console.log("📦 1. Đang nạp danh mục hệ thống (Permissions & Roles)...");

  for (const p of SEED.permissions) {
    await prisma.permission.upsert({
      where: { name: p.name },
      update: { description: p.description },
      create: p,
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
  console.log("🔗 2. Đang thiết lập ma trận quyền hạn (RBAC)...");

  // Quyền của Học viên (Chỉ xem và làm bài)
  const studentPerms = [
    "active-sessions:read", // Kiểm tra phiên thi hiện tại
    "active-sessions:write", // Bắt đầu thi và đồng bộ đáp án
    "active-sessions:delete", // Hủy phiên thi
    "exam-attempts:write", // Nộp bài thi
    "exam-attempts:read", // Xem lịch sử cá nhân (Từ NoSQL)
    "exam-attempts:read-detail", // Xem chi tiết lịch sử cá nhân (Từ NoSQL)
    "exam-histories:read", // Xem danh sách tóm tắt lịch sử thi (Từ SQL)
    "exam-histories:read-detail", // Xem chi tiết tóm tắt bài thi (Từ SQL)
    "statistics:read", // Xem thống kê tiến độ học tập cá nhân
  ];

  // Quyền của Giảng viên (Kế thừa Học viên + Quản lý nội dung)
  const instructorPerms = [
    ...studentPerms,
    "questions:read", // Truy vấn danh sách câu hỏi
    "questions:manage", // Thêm/sửa/xóa và khôi phục câu hỏi
    "questions:import", // Tiến trình import câu hỏi từ file hệ thống
    "chapters:read", // Xem danh sách/chi tiết chương học
    "chapters:manage", // Quản lý cấu trúc chương học
    "licenses:read", // Xem danh sách các hạng bằng lái
    "licenses:manage", // Quản lý cấu hình hạng bằng lái
    "exam-matrices:read", // Lấy danh sách ma trận cấu trúc đề thi
    "exam-matrices:manage", // Toàn quyền khởi tạo/cập nhật ma trận
    "exams:manage", // Khởi tạo (tự động/thủ công), cập nhật bộ đề
  ];

  const roleMapping = [
    { name: "ADMIN", perms: allPerms.map((p) => p.name) }, // Admin có trọn bộ quyền
    { name: "INSTRUCTOR", perms: instructorPerms },
    { name: "STUDENT", perms: studentPerms },
  ];

  for (const mapping of roleMapping) {
    const role = allRoles.find((r) => r.name === mapping.name);
    if (!role) continue;

    for (const permName of mapping.perms) {
      const perm = allPerms.find((p) => p.name === permName);
      if (!perm) continue;

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: role.id, permissionId: perm.id },
        },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
    }
  }

  // 3. Nạp Users & Gán Roles (Xử lý mảng users mới)
  console.log("👤 3. Đang khởi tạo danh sách người dùng mẫu...");
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
        status: "ACTIVE",
      },
    });

    // Gán danh sách Roles (Multi-role)
    for (const roleName of u.roleNames) {
      const role = allRoles.find((r) => r.name === roleName);
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
  console.log("📚 4. Đang nạp danh mục Hạng bằng & Chương học...");
  for (const l of SEED.licenses) {
    await prisma.licenseCategory.upsert({
      where: { name: l.name },
      update: {
        description: l.description,
        minAge: l.minAge,
        orderIndex: l.orderIndex,
      },
      create: l,
    });
  }

  // Lọc bỏ chương có mã 'CH07' trước khi đưa vào DB
  const filteredChapters = SEED.chapters.filter((c) => c.code !== "CH07");

  for (const c of filteredChapters) {
    await prisma.chapter.upsert({
      where: { code: c.code },
      update: {
        name: c.name,
        description: c.description,
        orderIndex: c.orderIndex,
      },
      create: c,
    });
  }

  // 5. Nạp Ma trận đề thi (Aggregate Root)
  console.log("📑 5. Đang nạp Ma trận đề thi ...");
  for (const m of SEED.examMatrices) {
    const license = await prisma.licenseCategory.findUnique({
      where: { name: m.licenseName },
    });
    if (!license) continue;

    const existingMatrix = await prisma.examMatrix.findFirst({
      where: { name: m.name, licenseCategoryId: license.id },
    });

    // Clean up details cũ để nạp mới hoàn toàn
    if (existingMatrix) {
      await prisma.examMatrixDetail.deleteMany({
        where: { examMatrixId: existingMatrix.id },
      });
    }

    await prisma.examMatrix.upsert({
      where: {
        id: existingMatrix?.id || "00000000-0000-0000-0000-000000000000",
      }, // ID giả định nếu ko có
      update: {
        totalQuestions: m.totalQuestions,
        passingScore: m.passingScore,
        durationMinutes: m.durationMinutes,
        details: {
          create: await Promise.all(
            m.details.map(async (d) => {
              const ch = await prisma.chapter.findUnique({
                where: { code: d.chapterCode },
              });
              return { chapterId: ch!.id, percentage: d.percentage };
            }),
          ),
        },
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
          create: await Promise.all(
            m.details.map(async (d) => {
              const ch = await prisma.chapter.findUnique({
                where: { code: d.chapterCode },
              });
              return { chapterId: ch!.id, percentage: d.percentage };
            }),
          ),
        },
      },
    });
  }

  console.log("✨ --- TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC ĐỒNG BỘ THÀNH CÔNG ---");
}

main()
  .catch((e: Error) => {
    console.error("❌ Lỗi Seed:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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
    "exams:manage", // Khởi tạo (tự động/thủ công), cập nhật bộ đề,
    "exams:read", // Khởi tạo (tự động/thủ công), cập nhật bộ đề
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
  for (const c of SEED.chapters) {
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

  // 6 Nạp Câu hỏi & Đáp án mẫu
  console.log("❓ 6. Đang nạp danh sách câu hỏi và đáp án mẫu...");

  for (const q of SEED.sampleQuestions) {
    // 1. Tìm Chapter Id dựa trên Code
    const chapter = await prisma.chapter.findUnique({
      where: { code: q.chapterCode },
    });
    if (!chapter) {
      console.warn(
        `❌ Bỏ qua câu hỏi số ${q.indexNumber} vì không tìm thấy Chapter code: ${q.chapterCode}`,
      );
      continue;
    }

    // 2. Tạo Question kèm Answers (Nested Write)
    const createdQuestion = await prisma.question.upsert({
      where: { id: `q-index-${q.indexNumber}` },
      update: {},
      create: {
        indexNumber: q.indexNumber,
        content: q.content,
        isCritical: q.isCritical,
        status: "ACTIVE",
        chapterId: chapter.id,
        answers: {
          create: q.answers,
        },
      },
    });

    // 3. Gán hạng bằng (License Links)
    for (const lName of q.licenses) {
      const license = await prisma.licenseCategory.findUnique({
        where: { name: lName },
      });
      if (license) {
        await prisma.questionLicenseCategory.upsert({
          where: {
            questionId_licenseCategoryId: {
              questionId: createdQuestion.id,
              licenseCategoryId: license.id,
            },
          },
          update: {},
          create: {
            questionId: createdQuestion.id,
            licenseCategoryId: license.id,
          },
        });
      }
    }
  }
  // 7. Khởi tạo Đề thi mẫu hệ thống (Tự động phân bổ câu hỏi linh hoạt theo từng Chương)
  console.log(
    "📝 7. Đang nạp danh sách Đề thi mẫu và tự động phân bổ câu hỏi theo Chương...",
  );

  const allChapters = await prisma.chapter.findMany({
    orderBy: { orderIndex: "asc" },
  });

  for (const e of SEED.mockExams) {
    const user = await prisma.user.findUnique({
      where: { email: e.userEmail },
    });
    const license = await prisma.licenseCategory.findUnique({
      where: { name: e.licenseName },
    });

    if (!user || !license) {
      console.log(
        `⚠️ Bỏ qua đề mẫu "${e.name}" do thiếu dữ liệu User hoặc License.`,
      );
      continue;
    }

    const examDoc = await prisma.exam.upsert({
      where: { name: e.name },
      update: {},
      create: {
        name: e.name,
        userId: user.id,
        examMatrixId: null,
        licenseCategoryId: license.id,
        isChapter: e.isChapter,
        totalQuestions: e.totalQuestions,
        passingScore: e.passingScore,
        durationMinutes: e.durationMinutes,
        minCriticalQuestions: e.minCriticalQuestions,
        status: "ACTIVE",
        score: 0,
        isPassed: false,
        startedAt: new Date(),
      },
    });

    await prisma.examQuestion.deleteMany({ where: { examId: examDoc.id } });

    let globalIndexNumber = 1; // Số thứ tự câu hỏi hiển thị trong đề (Câu 1, Câu 2...)

    // Vòng lặp duyệt qua từng chương để bốc câu hỏi
    for (const chapter of allChapters) {
      const currentCollected = globalIndexNumber - 1;
      const remainingNeeded = e.totalQuestions - currentCollected;

      // Nếu đã gom đủ 25 câu thì dừng bốc hỏi ngay lập tức
      if (remainingNeeded <= 0) break;

      // Lấy tối đa bằng số câu đang còn thiếu của đề để chạy cơ chế gánh bù
      const matchingQuestions = await prisma.question.findMany({
        where: {
          chapterId: chapter.id,
          licenseLinks: {
            some: { licenseCategoryId: license.id },
          },
        },
        include: {
          answers: { orderBy: { id: "asc" } },
        },
        take: remainingNeeded,
      });

      for (const coreQ of matchingQuestions) {
        // Kiểm tra lại nếu lỡ tay vượt quá số lượng câu của đề thì chặn đứng
        if (globalIndexNumber - 1 >= e.totalQuestions) break;

        const correctIndex = coreQ.answers.findIndex((a) => a.isCorrect) + 1;

        if (correctIndex === 0) {
          console.log(
            `⚠️ Câu hỏi ID ${coreQ.id} bỏ qua do không tìm thấy đáp án đúng.`,
          );
          continue;
        }

        await prisma.examQuestion.create({
          data: {
            examId: examDoc.id,
            questionId: coreQ.id,
            correctAnswer: correctIndex,
            isCritical: coreQ.isCritical,
            indexNumber: globalIndexNumber++,
          },
        });
      }
    }

    // Kiểm tra kết quả nạp cuối cùng của đề
    const totalAdded = globalIndexNumber - 1;
    if (totalAdded < e.totalQuestions) {
      console.log(
        `❌ LỖI: Đề "${e.name}" chỉ nạp được ${totalAdded}/${e.totalQuestions} câu. Hãy kiểm tra lại kho câu hỏi gốc.`,
      );
    } else {
      console.log(
        `✅ THÀNH CÔNG: Đề "${e.name}" đã nạp đủ chỉnh chu ${totalAdded}/${e.totalQuestions} câu hỏi.`,
      );
    }
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

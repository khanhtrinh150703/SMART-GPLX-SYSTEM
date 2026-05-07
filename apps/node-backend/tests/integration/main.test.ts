import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import { authSteps } from './steps/auth.test';
import { userSteps } from './steps/user.test';
import { licenseSteps } from './steps/license.test';
import { chapterSteps } from './steps/chapter.test';
import { questionSteps } from './steps/question-management.test';
import { cleanupDB, connectDB } from '../jest.setup';
import { selectionSteps } from './steps/selection.test';
import { AUTH_PAYLOAD, AUTH_ENDPOINTS, CHAPTER_ENDPOINTS, LICENSE_ENDPOINTS, EXAM_MATRIX_ENDPOINTS } from '../config/index'
import request from 'supertest';
import app from '@/app';
import { examMatrixSteps } from './steps/exam-matrix.test';
import { Chapter, ExamMatrix, LicenseCategory } from '@prisma/client';

describe('🏁 FULL SYSTEM INTEGRATION TEST FLOW', () => {
    // Shared Context: Dữ liệu dùng chung xuyên suốt các file
    let adminToken: string;
    let regularToken: string;
    let chapterId: string | undefined;
    let chapterIdSecond: string | undefined;
    let chapterIdThird: string | undefined;
    let chapterIdFour: string | undefined;
    let licenseId: string | undefined;
    let licenseSecond: string | undefined;
    let examMatrixId: string | undefined;

    // --- 🔑 SETUP: Khởi động, lấy Token và Dữ liệu nền ---
    beforeAll(async () => {
        // Kết nối Database 1 lần duy nhất
        await connectDB();

        const login = async (credentials: { username: string; password: string }, roleName: string): Promise<string> => {
            const res = await request(app)
                .post(AUTH_ENDPOINTS.LOGIN)
                .send(credentials);

            if (res.status !== 200) {
                console.error(`❌ [${roleName} Setup]: Login Failed!`, res.body);
                throw new Error(`Dừng test: Không thể lấy token cho ${roleName}.`);
            }

            return res.body.data.accessToken;
        };

        // 1. Đăng nhập song song hoặc tuần tự
        adminToken = await login(
            { username: AUTH_PAYLOAD.ADMIN_ACCOUNT.username, password: AUTH_PAYLOAD.ADMIN_ACCOUNT.password },
            'Admin'
        );

        regularToken = await login(
            { username: AUTH_PAYLOAD.NORMAL_ACCOUNT.username, password: AUTH_PAYLOAD.NORMAL_ACCOUNT.password },
            'Regular User'
        );

        // 2. Fetch dữ liệu từ API
        const [chapterRes, licenseRes, examMatrixRes] = await Promise.all([
            request(app)
                .get(CHAPTER_ENDPOINTS.FETCH_ALL)
                .set('Authorization', `Bearer ${adminToken}`),
            request(app)
                .get(LICENSE_ENDPOINTS.BASE)
                .set('Authorization', `Bearer ${adminToken}`),
            request(app)
                .get(EXAM_MATRIX_ENDPOINTS.BASE)
                .set('Authorization', `Bearer ${adminToken}`)
        ]);

        // 3. Ép kiểu dữ liệu (Cast type) để không phải dùng any
        const chapters = (chapterRes.body.data?.data || []) as Chapter[];
        const licenses = (licenseRes.body.data?.data || []) as LicenseCategory[];
        const examMatrix = (examMatrixRes.body.data?.data || []) as ExamMatrix[];

        const getChapter = (code: string) => chapters.find((c: Chapter) => c.code === code)?.id;
        const getLicense = (name: string) => licenses.find((l: LicenseCategory) => l.name === name)?.id;
        const getexamMatrix = (name: string) => examMatrix.find((ex: ExamMatrix) => ex.name === name)?.id;

        // 4. Tìm kiếm ID chính xác theo nghiệp vụ (c giờ đây là Chapter, l là License)
        chapterId = getChapter('1');
        chapterIdSecond = getChapter('5');
        chapterIdThird = getChapter('6');
        chapterIdFour = getChapter('7');

        licenseId = getLicense('CE');
        licenseSecond = getLicense('I');
        examMatrixId = getexamMatrix('Ma trận chuẩn Hạng CE');

        // 5. Kiểm tra an toàn (Guard Clause)
        if (!chapterId || !chapterIdSecond || !licenseId || !examMatrixId) {
            throw new Error('❌ Test Fail: Không tìm thấy Seed Data cho Code 1, 5 hoặc License A1');
        }
    });

    // =========================================================================
    // THỰC THI CÁC GIAI ĐOẠN (SEQUENTIAL EXECUTION)
    // =========================================================================

    describe('Phase 1: Authentication Operations', () => {
        authSteps();
    });

    describe('Phase 2: User Operations', () => {
        userSteps(() => adminToken);
    });

    describe('Phase 3: License Operations', () => {
        licenseSteps(
            () => adminToken,
            () => regularToken,
            () => licenseId as string,
            () => licenseSecond as string);
    });

    describe('Phase 4: Chapter Operations', () => {
        chapterSteps(
            () => adminToken,
            () => regularToken,
            () => chapterId as string,
            () => chapterIdFour as string);
    });

    describe('Phase 5: Question Operations', () => {
        questionSteps(
            () => adminToken,
            () => regularToken,
            () => chapterId as string,
            () => licenseId as string
        );
    });

    describe('Phase 6: Selection Operations', () => {
        selectionSteps(() => adminToken, () => regularToken);
    });

    describe('Phase 7: Exam-Matrix Operations', () => {
        examMatrixSteps(
            () => adminToken,
            () => regularToken,
            () => licenseId as string,
            () => chapterId as string,
            () => chapterIdSecond as string,
            () => chapterIdThird as string
        );
    });

    // =========================================================================
    // GIAI ĐOẠN CUỐI: ĐĂNG XUẤT (TEARDOWN & LOGOUT)
    // =========================================================================
    describe('Phase 8: Logout & Cleanup Session', () => {
        it('✅ Nên đăng xuất thành công và vô hiệu hóa session của Admin', async () => {
            const res = await request(app)
                .post(AUTH_ENDPOINTS.LOGOUT)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('✅ Nên bị từ chối (401) nếu cố gắng truy cập sau khi đã đăng xuất', async () => {
            const res = await request(app)
                .get(LICENSE_ENDPOINTS.BASE)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(401);
        });
    });

    // =========================================================================
    // DỌN DẸP DATABASE
    // =========================================================================
    afterAll(async () => {
        console.log("✅ Teardown hoàn tất: Database đã được dọn dẹp.");
        await cleanupDB();
    });
});
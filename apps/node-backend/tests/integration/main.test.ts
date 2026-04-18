import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import { authSteps } from './steps/auth.test';
import { userSteps } from './steps/user.test';
import { licenseSteps } from './steps/license.test';
import { chapterSteps } from './steps/chapter.test';
import { questionSteps } from './steps/question-management.test';
import { cleanupDB, connectDB } from '../jest.setup';
import { selectionSteps } from './steps/selection.test';
import { ADMIN_ACCOUNT, AUTH_ENDPOINTS, CHAPTER_ENDPOINTS, LICENSE_ENDPOINTS, NORMAL_ACCOUNT } from '../test.data';
import request from 'supertest';
import app from '@/app';
import { examMatrixSteps } from './steps/exam-matrix.test';

describe('🏁 FULL SYSTEM INTEGRATION TEST FLOW', () => {
    // Shared Context: Dữ liệu dùng chung xuyên suốt các file
    let adminToken: string;
    let regularToken: string;
    let chapterId: string;
    let chapterIdSecond: string;
    let chapterIdThird: string;
    let licenseId: string;

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
            { username: ADMIN_ACCOUNT.username, password: ADMIN_ACCOUNT.password },
            'Admin'
        );

        regularToken = await login(
            { username: NORMAL_ACCOUNT.username, password: NORMAL_ACCOUNT.password },
            'Regular User'
        );

        // 2. Lấy Chapter và License (Dùng adminToken đã lấy ở trên)
        const [chapterRes, licenseRes] = await Promise.all([
            request(app)
                .get(CHAPTER_ENDPOINTS.FETCH_ALL)
                .set('Authorization', `Bearer ${adminToken}`),
            request(app)
                .get(LICENSE_ENDPOINTS.BASE)
                .set('Authorization', `Bearer ${adminToken}`)
        ]);

        // 3. Gán ID và Kiểm tra dữ liệu nền (Seed data)
        chapterId = chapterRes.body.data?.data?.[0]?.id;
        chapterIdSecond = chapterRes.body.data?.data?.[1]?.id;
        chapterIdThird = chapterRes.body.data?.data?.[2]?.id; // Đã fix lại index [2] tránh trùng lặp
        licenseId = licenseRes.body.data?.data?.[0]?.id;

        if (!chapterId || !licenseId) {
            console.error("❌ Setup Error: Chapter hoặc License đang trống trong Database!");
            throw new Error("⚠️ Dừng test: Hãy chạy Seed data Chapter và License trước.");
        }

        console.log("✅ Setup hoàn tất: Đã có Token và ID cần thiết.");
    });

    // =========================================================================
    // THỰC THI CÁC GIAI ĐOẠN (SEQUENTIAL EXECUTION)
    // =========================================================================

    describe('Phase 1: Authentication Operations', () => {
        authSteps();
    });

    describe('Phase 2: User Operations', () => {
        userSteps();
    });

    describe('Phase 3: License Operations', () => {
        licenseSteps(() => adminToken, () => regularToken);
    });

    describe('Phase 4: Chapter Operations', () => {
        chapterSteps(() => adminToken, () => regularToken);
    });

    describe('Phase 5: Question Operations', () => {
        questionSteps(
            () => adminToken,
            () => regularToken,
            () => chapterId,
            () => licenseId
        );
    });

    describe('Phase 6: Selection Operations', () => {
        selectionSteps(() => adminToken, () => regularToken);
    });

    describe('Phase 7: Exam-Matrix Operations', () => {
        examMatrixSteps(
            () => adminToken,
            () => regularToken,
            () => licenseId,
            () => chapterId,
            () => chapterIdSecond,
            () => chapterIdThird
        );
    });

    // =========================================================================
    // GIAI ĐOẠN CUỐI: ĐĂNG XUẤT (TEARDOWN & LOGOUT)
    // =========================================================================
    describe('Phase 8: Logout & Cleanup Session', () => {
        it('✅ Nên đăng xuất thành công và vô hiệu hóa session của Admin', async () => {
            const res = await request(app)
                .post(AUTH_ENDPOINTS.LOGOUT)
                // Sử dụng biến adminToken trực tiếp thay vì getAdminToken() để đảm bảo lấy đúng session đang test
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('✅ Nên bị từ chối (401) nếu cố gắng truy cập sau khi đã đăng xuất', async () => {
            const res = await request(app)
                .get(LICENSE_ENDPOINTS.BASE) // Thử gọi một API bất kỳ cần quyền
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
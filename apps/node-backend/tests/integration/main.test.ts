import { beforeAll, afterAll, describe } from '@jest/globals';
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


describe('🏁 FULL SYSTEM INTEGRATION TEST FLOW', () => {
    // Shared Context: Dữ liệu dùng chung xuyên suốt các file
    let adminToken: string;
    let regularToken: string;
    let chapterId: string;
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

        // 1. Đăng nhập song song để tiết kiệm thời gian (Optional) hoặc tuần tự
        adminToken = await login(
            { username: ADMIN_ACCOUNT.username, password: ADMIN_ACCOUNT.password },
            'Admin'
        );

        regularToken = await login(
            { username: NORMAL_ACCOUNT.username, password: NORMAL_ACCOUNT.password },
            'Regular User'
        );

        // 2. Lấy Chapter và License (Dùng adminToken đã lấy ở trên)
        // Sử dụng Promise.all để lấy cả 2 cùng lúc cho nhanh
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
        licenseId = licenseRes.body.data?.data?.[0]?.id;

        if (!chapterId || !licenseId) {
            console.error("❌ Setup Error: Chapter hoặc License đang trống trong Database!");
            throw new Error("⚠️ Dừng test: Hãy chạy Seed data Chapter và License trước.");
        }

        console.log("✅ Setup hoàn tất: Đã có Token và ID cần thiết.");
    });

    // Chạy các Phase (Giai đoạn) theo thứ tự
    describe('Phase 1: Authentication', () => {
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
            () => licenseId // Sửa từ chapterId thành licenseId ở đây
        );
    });

    describe('Phase 6 : Question Operations', () => {
        selectionSteps(() => adminToken, () => regularToken);
    });

    // Dọn dẹp DB sau khi tất cả đã xong
    afterAll(async () => {
        await cleanupDB();
    });
});
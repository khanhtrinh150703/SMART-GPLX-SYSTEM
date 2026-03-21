import { beforeAll, afterAll, describe } from '@jest/globals';
import { connectDB, cleanupDB } from '../db.setup';
import { authSteps } from './steps/auth.test';
import { userSteps } from './steps/user.test';


describe('🏁 FULL SYSTEM INTEGRATION TEST FLOW', () => {
    // Shared Context: Dữ liệu dùng chung xuyên suốt các file

    // Khởi động DB 1 lần duy nhất
    beforeAll(async () => {
        await connectDB();
    });

    // Chạy các Phase (Giai đoạn) theo thứ tự
    describe('Phase 1: Authentication', () => {
        authSteps();
    });

    describe('Phase 2: User Operations', () => {
        userSteps();
    });

    // Dọn dẹp DB sau khi tất cả đã xong
    afterAll(async () => {
        await cleanupDB();
    });
});
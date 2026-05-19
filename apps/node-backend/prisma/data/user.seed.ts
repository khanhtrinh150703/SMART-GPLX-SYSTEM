import { UserSeed } from "./interface.seed";

export const users: UserSeed[] = [
  {
    username: 'admin',
    email: process.env.SEED_ADMIN_EMAIL || 'admin@smartgplx.com',
    password: process.env.SEED_ADMIN_PASSWORD || 'AdminPassword123@',
    fullName: 'Quản trị viên hệ thống',
    phoneNumber: process.env.SEED_ADMIN_PHONE || '0999999999',
    roleNames: ['ADMIN'],
  },
  {
    username: 'instructor_test',
    email: process.env.SEED_INSTRUCTOR_EMAIL || 'instructor@smartgplx.com',
    password: process.env.SEED_INSTRUCTOR_PASSWORD || 'InstructorPassword123@',
    fullName: 'Giảng viên hướng dẫn',
    phoneNumber: process.env.SEED_INSTRUCTOR_PHONE || '0977777777',
    roleNames: ['INSTRUCTOR'],
  },
  {
    username: 'student_test',
    email: process.env.SEED_STUDENT_EMAIL || 'testuser@smartgplx.com',
    password: process.env.SEED_STUDENT_PASSWORD || 'UserPassword123@',
    fullName: 'Học viên dùng thử',
    phoneNumber: process.env.SEED_STUDENT_PHONE || '0988888888',
    roleNames: ['STUDENT'],
  },
  {
    username: 'testusertemp',
    email: process.env.SEED_TEMP_EMAIL || 'temp@smartgplx.com',
    password: process.env.SEED_TEMP_PASSWORD || 'TempPassword123@',
    fullName: 'Học viên dự phòng (Multi-role)',
    phoneNumber: process.env.SEED_TEMP_PHONE || '0966666666',
    roleNames: ['STUDENT', 'INSTRUCTOR'],
  },
];
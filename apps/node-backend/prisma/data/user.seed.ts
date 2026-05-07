import { UserSeed } from "../interface.seed";

export const users: UserSeed[] = [
  {
    username: 'admin',
    email: 'admin@smartgplx.com',
    password: 'AdminPassword123@',
    fullName: 'Quản trị viên hệ thống',
    phoneNumber: '0999999999',
    roleNames: ['ADMIN'],
  },
  {
    username: 'instructor_test',
    email: 'instructor@smartgplx.com',
    password: 'InstructorPassword123@',
    fullName: 'Giảng viên hướng dẫn',
    phoneNumber: '0977777777',
    roleNames: ['INSTRUCTOR'],
  },
  {
    username: 'student_test',
    email: 'testuser@smartgplx.com',
    password: 'UserPassword123@',
    fullName: 'Học viên dùng thử',
    phoneNumber: '0988888888',
    roleNames: ['STUDENT'],
  },
  {
    username: 'testusertemp',
    email: 'temp@smartgplx.com',
    password: 'TempPassword123@',
    fullName: 'Học viên dự phòng (Multi-role)',
    phoneNumber: '0966666666',
    roleNames: ['STUDENT', 'INSTRUCTOR'], // User này có 2 quyền
  },
];
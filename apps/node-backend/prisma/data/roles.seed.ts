import { RoleSeed } from "./interface.seed";

export const roles: RoleSeed[] = [
  {
    name: 'ADMIN',
    description: 'Quản trị viên hệ thống',
    permissions: ['admin:all']
  },
  {
    name: 'INSTRUCTOR',
    description: 'Giảng viên/Người ra đề',
    permissions: ['questions:read', 'questions:write', 'chapters:read', 'matrices:read']
  },
  {
    name: 'STUDENT',
    description: 'Học viên/Thí sinh',
    permissions: ['chapters:read', 'exams:take', 'results:read', 'profile:manage']
  },
];
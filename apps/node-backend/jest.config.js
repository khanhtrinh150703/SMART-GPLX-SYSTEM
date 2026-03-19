module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/src'], 
  testMatch: ['**/*.test.ts'], // Chỉ tìm các file kết thúc bằng .test.ts
  moduleNameMapper: {
    // Nếu bạn có dùng alias trong tsconfig (như @domain), hãy map ở đây
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'], // Nếu cần setup DB trước khi test
};
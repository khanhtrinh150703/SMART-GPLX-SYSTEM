export const STORAGE_CONFIG = {
  TEMP_DIR: process.env.TEMP_STORAGE_PATH || 'storage/temp',
  UPLOAD_DIR: process.env.UPLOAD_STORAGE_PATH || 'storage/uploads',
  PUBLIC_DIR: process.env.UPLOAD_DIR || 'public/uploads',
  STATIC_PREFIX: process.env.STATIC_PREFIX || 'uploads',
  // Quy ước cấu trúc file ZIP khi Import
  IMPORT_CONVENTION: {
    IMAGE_FOLDER: 'images',      // Thư mục chứa ảnh trong ZIP
    EXCEL_NAME: 'questions.xlsx' // Tên file Excel cố định
  },
  FOLDERS: {
    PROFILE: 'profiles',
    QUESTION: 'questions',
    ANSWER: 'answers',
    LICENSE_CATEGORIES: 'license-categories',
  },
  MAX_FILE_SIZE: 5 * 1024 * 1024
};


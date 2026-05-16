// data.seed.ts

// --- Interfaces ---

export interface UserSeed {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  roleNames: string[];
}

export interface PermissionSeed {
  name: string;
  description: string;
}

export interface RoleSeed {
  name: string;
  description: string;
  permissions: string[]; // Danh sách tên permission
}

export interface LicenseSeed {
  name: string;
  description: string;
  minAge: number;
  orderIndex: number;
}

export interface ChapterSeed {
  code: string;
  name: string;
  description: string;
  orderIndex: number;
}

export interface MatrixDetailSeed {
  chapterCode: string; // Dùng code để tìm ID
  percentage: number;
}

export interface MatrixSeed {
  name: string;
  licenseName: string; // Dùng name để tìm ID (A1, B2...)
  totalQuestions: number;
  passingScore: number;
  durationMinutes: number;
  minCriticalQuestions: number;
  isDefault: boolean;
  details: MatrixDetailSeed[];
}

export interface IAnswerSeed {
  content: string;
  isCorrect: boolean;
  imageUrl?: string;
}

export interface IQuestionSeed {
  indexNumber: number;
  content: string;
  isCritical: boolean;
  chapterCode: string;
  licenses: string[];
  answers: IAnswerSeed[];
  imageUrl?: string;
  difficultyLevel?: number;
}

export interface IExamQuestionSeed {
  questionIndexNumber: number;
  correctAnswer: number;
  isCritical: boolean;
  indexNumber: number;
}

export interface IExamSeed {
  name: string;
  userEmail: string;          
  licenseName: string;        
  isChapter: boolean;
  totalQuestions: number;       
  passingScore: number;        
  durationMinutes: number;      
  minCriticalQuestions: number; 
}

// --- Data ---

import { ExamStatus } from "./enums";

// Dữ liệu truyền lên để sinh đề (Data Transfer Object for generating exam)
export interface IGenerateExamDTO {
  matrixId: string;
  name: string;
  status: ExamStatus;
}

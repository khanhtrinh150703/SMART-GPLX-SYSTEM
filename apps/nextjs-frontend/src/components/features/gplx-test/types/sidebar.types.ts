// src/features/gplx-test/types/sidebar.types.ts

import { IExamUserQuestionResponseDTO } from "./exam-result.types";
import { IExamQuestion } from "./exam-session.types";



/**
 * Union Type: Kết hợp cả hai loại dữ liệu câu hỏi (Testing & Review).
 * Giúp Sidebar hiểu được cả dữ liệu thô và dữ liệu đã chấm điểm.
 */
export type SidebarQuestion = IExamQuestion | IExamUserQuestionResponseDTO;
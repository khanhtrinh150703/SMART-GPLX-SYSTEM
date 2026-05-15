import { PaginatedResult } from "@/types/paginaton.type";
import { IExamFullContent } from "../../gplx-test/types/exam-session.types";
import { 
  IExamHistorySummary, 
  HistoryQueryParams 
} from "../types/history.types";

export interface HistoryState {
  // Data State (Trạng thái dữ liệu)
  historyList: IExamHistorySummary[];
  pagination: PaginatedResult<IExamHistorySummary> | null;
  selectedHistory: IExamFullContent | null;

  // Actions (Hành động nghiệp vụ)
  getHistoryList: (params: HistoryQueryParams) => Promise<void>;
  getHistoryDetail: (id: string) => Promise<void>;
  resetSelectedHistory: () => void;
}
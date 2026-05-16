// src/features/chapter/hooks/use-chapter-actions.ts
import { useState, useCallback } from "react";
import axios from "axios";
import { StandardResponse } from "@/types/common.type";
import {
  Chapter,
  CreateChapterRequest,
  UpdateChapterRequest,
} from "../types/chapter.types";
import { DeleteResponse } from "@/types/respone/delete.common";

interface MutationObject<TVariables, TData> {
  mutateAsync: (variables: TVariables) => Promise<StandardResponse<TData>>;
  isPending: boolean;
}

export interface ChapterMutationSet {
  create: MutationObject<CreateChapterRequest, Chapter>;
  update: MutationObject<{ id: string; data: UpdateChapterRequest }, Chapter>;
  remove: MutationObject<string, DeleteResponse>;
  restore: MutationObject<string, Chapter>;
}

export function useChapterActions(mutations: ChapterMutationSet) {
  const [message, setMessage] = useState<{
    intent: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  /**
   * Executor (Hàm thực thi): Hỗ trợ thông báo tĩnh (string) hoặc động (callback).
   * (Executor: Supports static or dynamic success messages via callback).
   */
  const execute = useCallback(
    async <T>(
      action: () => Promise<StandardResponse<T>>,
      successMsg: string | ((data: T) => string), // Chấp nhận cả string và hàm (Accepts string or function)
    ): Promise<StandardResponse<T> | undefined> => {
      try {
        setMessage(null);
        const res = await action();

        /**
         * Ép kiểu 'res.data as T' để đảm bảo dữ liệu luôn khả dụng cho callback.
         * (Cast 'res.data as T' to ensure data availability for the callback).
         */
        const finalMsg =
          typeof successMsg === "function"
            ? successMsg(res.data as T)
            : successMsg;

        setMessage({ intent: "success", text: finalMsg });
        return res;
      } catch (error: unknown) {
        let errorText = "Đã xảy ra lỗi không xác định";

        if (axios.isAxiosError(error)) {
          errorText = error.response?.data?.message || "Lỗi kết nối máy chủ";
        } else if (error instanceof Error) {
          errorText = error.message;
        }

        setMessage({ intent: "error", text: errorText });
        throw error;
      }
    },
    [],
  );

  // --- PUBLIC HANDLERS ---

  const onCreate = useCallback(
    (data: CreateChapterRequest) =>
      execute(
        () => mutations.create.mutateAsync(data),
        "Thêm mới chương bài học thành công!",
      ),
    [execute, mutations.create],
  );

  const onUpdate = useCallback(
    (id: string, data: UpdateChapterRequest) =>
      execute(
        () => mutations.update.mutateAsync({ id, data }),
        "Cập nhật thông tin thành công!",
      ),
    [execute, mutations.update],
  );

  const onDelete = useCallback(
    (id: string) =>
      execute(
        () => mutations.remove.mutateAsync(id),
        (data: DeleteResponse) => {
          const action = data.isPermanent
            ? "xóa vĩnh viễn"
            : "chuyển vào thùng rác";
          const extra =
            data.count > 0 ? ` (bao gồm ${data.count} câu hỏi liên quan)` : "";
          return `Đã ${action} chương thành công${extra}.`;
        },
      ),
    [execute, mutations.remove],
  );

  const onRestore = useCallback(
    (id: string) =>
      execute(
        () => mutations.restore.mutateAsync(id),
        "Khôi phục chương thành công!",
      ),
    [execute, mutations.restore],
  );

  return {
    message,
    setMessage,
    clearMessage: useCallback(() => setMessage(null), []),
    onCreate,
    onUpdate,
    onDelete,
    onRestore,
    pendingStates: {
      isCreating: mutations.create.isPending,
      isUpdating: mutations.update.isPending,
      isDeleting: mutations.remove.isPending,
      isRestoring: mutations.restore.isPending,
    },
    isAnyActionPending:
      mutations.create.isPending ||
      mutations.update.isPending ||
      mutations.remove.isPending ||
      mutations.restore.isPending,
  };
}

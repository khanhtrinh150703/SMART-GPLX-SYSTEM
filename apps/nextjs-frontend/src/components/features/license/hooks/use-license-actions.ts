import { useState, useCallback } from "react";
import axios from "axios";
import { StandardResponse } from "@/types/common.type";
import {
  LicenseCategory,
  CreateLicenseCategoryRequest,
  UpdateLicenseCategoryRequest,
} from "../types/license-category.types";
import { DeleteResponse } from "@/types/respone/delete.common";

// Định nghĩa lại Type cho Mutation để khớp với TanStack Query
interface MutationObject<TVariables, TData> {
  mutateAsync: (variables: TVariables) => Promise<StandardResponse<TData>>;
  isPending: boolean;
}

// 1. Cập nhật Interface: Đảm bảo 'remove' trả về 'DeleteResponse' thay vì 'void'
interface LicenseMutationSet {
  create: MutationObject<CreateLicenseCategoryRequest, LicenseCategory>;
  update: MutationObject<
    { id: string; data: UpdateLicenseCategoryRequest },
    LicenseCategory
  >;
  remove: MutationObject<string, DeleteResponse>; // Đã sửa từ void thành DeleteResponse
  restore: MutationObject<string, LicenseCategory>;
}

export function useLicenseActions(mutations: LicenseMutationSet) {
  const [message, setMessage] = useState<{
    intent: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  /**
   * Executor: Hỗ trợ successMsg là string hoặc function để hứng data từ BE.
   * (Dịch: Executor supports string or function successMsg to catch BE data)
   */
  const execute = useCallback(
    async <T>(
      action: () => Promise<StandardResponse<T>>,
      successMsg: string | ((data: T) => string), // Chấp nhận string hoặc callback
    ): Promise<StandardResponse<T> | undefined> => {
      try {
        setMessage(null);
        const res = await action();

        // 2. Logic xử lý thông báo động (Dynamic message logic)
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

  const onDelete = useCallback(
    (id: string) =>
      execute(
        () => mutations.remove.mutateAsync(id),
        (data: DeleteResponse) => {
          // Hứng data từ BE nhả về
          const action = data.isPermanent
            ? "xóa vĩnh viễn"
            : "chuyển vào thùng rác";
          const extra =
            data.count > 0 ? ` (bao gồm ${data.count} dữ liệu liên quan)` : "";

          return `Đã ${action} hạng bằng lái thành công${extra}.`;
        },
      ),
    [execute, mutations.remove],
  );

  // Các hàm khác giữ nguyên cấu trúc truyền string
  const onCreate = useCallback(
    (data: CreateLicenseCategoryRequest) =>
      execute(() => mutations.create.mutateAsync(data), "Thêm mới thành công!"),
    [execute, mutations.create],
  );

  const onUpdate = useCallback(
    (id: string, data: UpdateLicenseCategoryRequest) =>
      execute(
        () => mutations.update.mutateAsync({ id, data }),
        "Cập nhật thành công!",
      ),
    [execute, mutations.update],
  );

  const onRestore = useCallback(
    (id: string) =>
      execute(() => mutations.restore.mutateAsync(id), "Khôi phục thành công!"),
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

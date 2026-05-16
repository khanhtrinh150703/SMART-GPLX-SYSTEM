// src/features/user/hooks/use-user-actions.ts
import { useState, useCallback } from "react";
import axios from "axios";
import { StandardResponse } from "@/types/common.type";
import { CreateUserPayload, AdminUpdatePayload } from "../schema/user.schema";
import { UserResponseDTO } from "../types/user-respone";

interface MutationObject<TVariables, TData> {
  mutateAsync: (variables: TVariables) => Promise<StandardResponse<TData>>;
  isPending: boolean;
}

export interface UserMutationSet {
  create: MutationObject<CreateUserPayload, UserResponseDTO>;
  update: MutationObject<{ id: string; data: AdminUpdatePayload }, UserResponseDTO>;
  remove: MutationObject<string, void>;
  unlock: MutationObject<string, void>;
  restore: MutationObject<string, UserResponseDTO>;
}

export function useUserActions(mutations: UserMutationSet) {
  const [message, setMessage] = useState<{
    intent: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  /**
   * Executor (Hàm thực thi): Đảm bảo an toàn kiểu dữ liệu với Generic <T>
   */
  const execute = useCallback(
    async <T,>(
      action: () => Promise<StandardResponse<T>>,
      successMsg: string
    ): Promise<StandardResponse<T> | undefined> => {
      try {
        setMessage(null);
        const res = await action();
        setMessage({ intent: "success", text: successMsg });
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
    []
  );

  // --- PUBLIC HANDLERS (STRICT TYPING - KHÔNG ANY) ---

  const onCreate = useCallback(
    (data: CreateUserPayload) =>
      execute(
        () => mutations.create.mutateAsync(data),
        "Thêm mới học viên thành công!"
      ),
    [execute, mutations.create]
  );

  const onUpdate = useCallback(
    (id: string, data: AdminUpdatePayload) =>
      execute(
        () => mutations.update.mutateAsync({ id, data }),
        "Cập nhật thành công! "
      ),
    [execute, mutations.update]
  );

  const onDelete = useCallback(
    (id: string) =>
      execute(
        () => mutations.remove.mutateAsync(id),
        "Đã khóa/xóa người dùng thành công! "
      ),
    [execute, mutations.remove]
  );

  const onUnlock = useCallback(
    (id: string) =>
      execute(
        () => mutations.unlock.mutateAsync(id),
        "Mở khóa tài khoản thành công!"
      ),
    [execute, mutations.unlock]
  );

  const onRestore = useCallback(
    (id: string) =>
      execute(
        () => mutations.restore.mutateAsync(id),
        "Khôi phục tài khoản thành công! (Restore success)"
      ),
    [execute, mutations.restore]
  );

  return {
    message,
    setMessage,
    clearMessage: () => setMessage(null),
    onCreate,
    onUpdate,
    onDelete,
    onUnlock,
    onRestore,
    pendingStates: {
      isCreating: mutations.create.isPending,
      isUpdating: mutations.update.isPending,
      isDeleting: mutations.remove.isPending,
    },
  };
}
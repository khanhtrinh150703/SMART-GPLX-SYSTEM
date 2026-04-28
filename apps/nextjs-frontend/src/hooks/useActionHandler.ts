import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/error-handler";
import { StandardResponse } from "@/types/common.type";

export type MessageIntent = "success" | "error" | "warning" | "info";

export interface AppMessage {
  intent: MessageIntent;
  text: string;
}

export const useActionHandler = () => {
  const [message, setMessage] = useState<AppMessage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * T là kiểu dữ liệu của phần 'data' trong StandardResponse
   */
  const handleAction = useCallback(async <T>(
    actionFn: () => Promise<StandardResponse<T>>,
    options?: {
      onSuccess?: (data: T | undefined) => void;
      successMsg?: string;
      autoClose?: () => void;
      delay?: number;
    }
  ): Promise<StandardResponse<T> | undefined> => {
    setMessage(null);
    setIsLoading(true);

    try {
      const response = await actionFn();
      
      // Hiển thị message từ API trả về hoặc message custom
      setMessage({
        intent: "success",
        text: options?.successMsg || response.message || "Thao tác thành công!",
      });

      if (options?.onSuccess) options.onSuccess(response.data);
      if (options?.autoClose) setTimeout(options.autoClose, options.delay || 1200);

      return response;
    } catch (error: unknown) {
      const errorText = getErrorMessage(error);
      setMessage({ intent: "error", text: errorText });
      
      // Re-throw để các lớp trên (như React Query) có thể nhận biết lỗi
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { message, setMessage, isLoading, handleAction };
};
import { StandardResponse } from "@/types/common.type";

/**
 * Smart Navigation Logic - Điều hướng quay lại an toàn
 * @returns StandardResponse để đồng bộ với bộ xử lý lỗi tập trung
 */
export const performSmartNavigateBack = async (): Promise<StandardResponse<undefined>> => {
  // 1. Kiểm tra môi trường Browser
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("Môi trường không hỗ trợ điều hướng (SSR Context)");
  }

  const referrer = document.referrer;
  const currentOrigin = window.location.origin;

  // 2. Trường hợp không có Referrer -> Quay về trang chủ
  if (!referrer) {
    window.location.href = "/";
    return {
      success: true,
      code: "NAV_HOME",
      statusCode: 200,
      message: "Không tìm thấy lịch sử, đang về trang chủ...",
    };
  }

  try {
    const referrerUrl = new URL(referrer);

    // 3. Kiểm tra Same-Origin (Chốt chặn bảo mật)
    if (referrerUrl.origin === currentOrigin) {
      // Cùng nguồn -> Ép tải lại trang (F5) để đồng bộ dữ liệu
      window.location.href = referrer;
      return {
        success: true,
        code: "NAV_BACK",
        statusCode: 200,
        message: "Đang quay lại trang trước...",
      };
    } else {
      // Khác nguồn (đến từ Web khác) -> Về Home cho an toàn
      window.location.href = "/";
      return {
        success: true,
        code: "NAV_EXTERNAL_GUARD",
        statusCode: 200,
        message: "Đang quay về trang chủ...",
      };
    }
  } catch (error: unknown) {
    // 💡 Không dùng any: Ném lỗi để handleAction bóc tách qua getErrorMessage
    throw new Error("Đường dẫn trước đó không hợp lệ (Invalid Referrer)");
  }
};
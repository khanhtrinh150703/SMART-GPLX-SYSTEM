import Cookies from "js-cookie";

/**
 * @description Quản lý lưu trữ Token vào Browser Cookie
 */
export const authCookie = {
  set: (access: string, refresh?: string | null) => {
    Cookies.set("accessToken", access, { expires: 7, secure: true, sameSite: "strict" });
    if (refresh) {
      Cookies.set("refreshToken", refresh, { expires: 30, secure: true, sameSite: "strict" });
    }
  },
  clear: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  },
  getAccess: () => Cookies.get("accessToken"),
  getRefresh: () => Cookies.get("refreshToken"),
};
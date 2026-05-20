import basicAuth from "express-basic-auth";
export const swaggerAuth = basicAuth({
  users: {
    [process.env.SWAGGER_USER || "admin"]:
      process.env.SWAGGER_PASSWORD || "MatKhauSieuKho123!",
  },
  challenge: true,
  unauthorizedResponse: "Bạn không có quyền truy cập tài liệu API này.",
});

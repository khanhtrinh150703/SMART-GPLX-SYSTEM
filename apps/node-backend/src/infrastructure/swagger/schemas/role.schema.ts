/**
 * @description Định nghĩa Schema cho Module Roles
 * Đồng bộ tuyệt đối với RoleResponseDTO class và IRoleResponseDTO interface.
 */
export const roleSchemas = {
  /**
   * @description DTO vận chuyển dữ liệu Vai trò (Role)
   */
  RoleResponseDTO: {
    type: "object",
    required: ["id", "name"], // displayName là optional nên không đưa vào đây
    properties: {
      id: {
        type: "string",
        format: "uuid",
        description: "Mã định danh duy nhất của vai trò (UUID).",
        example: "550e8400-e29b-41d4-a716-446655440000",
      },
      name: {
        type: "string",
        description: "Tên định danh kỹ thuật (VD: 'ADMIN', 'STUDENT').",
        example: "ADMIN",
      },
      displayName: {
        type: "string",
        nullable: true, // Vì là optional trong DTO
        description: "Tên hiển thị thân thiện trên giao diện.",
        example: "Quản trị viên hệ thống",
      },
    },
  },
};

import { securityResponses } from "../swaggerHelpers";

/**
 * @description Path definitions for Selection Data (Dropdowns)
 * Các API này phục vụ việc lấy dữ liệu rút gọn cho UI Components.
 */
export const selectionPaths = {
  // --- CHAPTER SELECTION ---
  "/chapters/selection": {
    get: {
      tags: ["Selection Data {Private)"],
      summary: "Lấy danh sách chương học (Dropdown)",
      description: "Trả về mảng gồm { value: id, label: name }.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SelectionListResponse" },
            },
          },
        },
        ...securityResponses, // Spread chuẩn vào trong object responses
      },
    },
  },

  // --- LICENSE CATEGORY SELECTION ---
  "/license-categories/selection": {
    get: {
      tags: ["Selection Data {Private)"],
      summary: "Lấy danh sách hạng bằng lái (Dropdown)",
      description: "Trả về mảng gồm { value: id, label: code }.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SelectionListResponse" },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  // --- ROLE SELECTION ---
  "/roles/selection": {
    get: {
      tags: ["Selection Data {Private)"],
      summary: "Lấy danh sách chức vụ (Dropdown)",
      description: "Trả về mảng gồm { value: id, label: code }.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SelectionListResponse" },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  // --- EXAM MATRIX SELECTION ---
  "/exam-matrices/selection": {
    get: {
      tags: ["Selection Data {Private)"],
      summary: "Lấy danh sách ma trận đề thi (Kèm thông số kỹ thuật)",
      description:
        "Trả về dữ liệu rút gọn kèm metadata (score, duration, questions) để hiển thị nhanh trên UI.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              // Trỏ vào Schema mở rộng thay vì SelectionListResponse chung chung
              schema: {
                $ref: "#/components/schemas/ExamMatrixSelectionListResponse",
              },
            },
          },
        },
        ...securityResponses,
      },
    },
  },
};

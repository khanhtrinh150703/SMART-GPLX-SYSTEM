import { securityResponses } from "../helper/swaggerHelpers";

export const activeSessionPaths = {
  // 1. GET CURRENT SESSION (Lấy phiên đang làm dở)
  [`/active-sessions/current`]: {
    get: {
      tags: ["Active Session (Private)"],
      summary: "Lấy phiên làm bài dở dang hiện tại",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Trả về dữ liệu phiên đang chạy",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ActiveSessionSingleResponse",
              },
            },
          },
        },
        404: {
          description: "Không có phiên nào đang chạy",
          content: {
            "application/json": {
              example: { code: "SES_404", message: "Không tìm thấy phiên thi" },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  // 2. START SESSION (Bắt đầu phiên cho Học viên)
  [`/active-sessions/start`]: {
    post: {
      tags: ["Active Session (Private)"],
      summary: "Bắt đầu phiên thi chính thức",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/StartSessionRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo phiên thành công và trả về thông tin phiên",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ActiveSessionSingleResponse",
              },
            },
          },
        },
        400: {
          description: "Lỗi dữ liệu",
          content: {
            "application/json": {
              example: { code: "SES_101", message: "ID đề thi không hợp lệ" },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  // 3. START GUEST SESSION (Bắt đầu phiên cho Khách thi thử)
  [`/active-sessions/guest/start`]: {
    post: {
      tags: ["Active Session (Public)"],
      summary: "Khởi tạo phiên thi thử (Khách)",
      requestBody: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/StartSessionRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Khởi tạo thành công phiên nháp ảo",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ActiveSessionSingleResponse",
              },
            },
          },
        },
        400: {
          description: "Lỗi định danh",
          content: {
            "application/json": {
              example: { code: "SES_101", message: "ID đề thi không hợp lệ" },
            },
          },
        },
      },
    },
  },
};

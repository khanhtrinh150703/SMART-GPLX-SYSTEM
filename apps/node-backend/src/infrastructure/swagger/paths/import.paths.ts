import { securityResponses } from "../swaggerHelpers";

export const importPaths = {
  /**
   * ==========================================
   * BƯỚC 1: KHỞI TẠO PHIÊN (INIT SESSION)
   * ==========================================
   */
  [`/import/init`]: {
    post: {
      tags: ["Import (Private)"],
      summary: "Khởi tạo phiên Import (Step 1)",
      description:
        "Tạo Job ID và thiết lập cấu hình chia mảnh (chunking) cho file.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["fileName", "totalSize", "totalChunks"],
              properties: {
                fileName: { type: "string", example: "cau-hoi-gplx-b2.xlsx" },
                totalSize: {
                  type: "integer",
                  example: 10485760,
                  description: "Kích thước byte",
                },
                totalChunks: { type: "integer", example: 5 },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Khởi tạo thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ImportJobResponseDTO" },
            },
          },
        },
        400: {
          description: "Lỗi tham số đầu vào (IMP_1XX)",
          content: {
            "application/json": {
              examples: {
                fileNameEmpty: {
                  value: {
                    success: false,
                    code: "IMP_101",
                    message: "Tên tệp không được để trống",
                  },
                },
                sizeInvalid: {
                  value: {
                    success: false,
                    code: "IMP_102",
                    message: "Kích thước tệp không hợp lệ",
                  },
                },
                chunksInvalid: {
                  value: {
                    success: false,
                    code: "IMP_103",
                    message: "Số lượng mảnh (chunks) không hợp lệ",
                  },
                },
              },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  /**
   * ==========================================
   * BƯỚC 2: TẢI LÊN TỪNG MẢNH (UPLOAD CHUNK)
   * ==========================================
   */
  [`/import/upload-chunk`]: {
    post: {
      tags: ["Import (Private)"],
      summary: "Tải lên mảnh dữ liệu (Step 2)",
      description: "Gửi từng mảnh file kèm theo Job ID.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["jobId", "chunk"],
              properties: {
                jobId: { type: "string", format: "uuid" },
                chunk: {
                  type: "string",
                  format: "binary",
                  description: "Mảnh file tương ứng",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Mảnh dữ liệu được chấp nhận" },
        400: {
          description: "Lỗi hạ tầng Upload (IMP_0XX)",
          content: {
            "application/json": {
              examples: {
                jobIdMissing: {
                  value: {
                    success: false,
                    code: "IMP_104",
                    message: "Mã công việc import là bắt buộc",
                  },
                },
                chunkIndexInv: {
                  value: {
                    success: false,
                    code: "IMP_003",
                    message: "Số thứ tự mảnh (index) không hợp lệ",
                  },
                },
                fileMissing: {
                  value: {
                    success: false,
                    code: "IMP_005",
                    message: "Không tìm thấy file trong yêu cầu",
                  },
                },
                chunkTooLarge: {
                  value: {
                    success: false,
                    code: "IMP_006",
                    message: "Kích thước mảnh vượt quá giới hạn",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Phiên làm việc hết hạn",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "IMP_007",
                message: "Phiên làm việc Import đã hết hạn",
              },
            },
          },
        },
        403: securityResponses[403],
        404: {
          description: "Không tìm thấy Job",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "IMP_001",
                message: "Không tìm thấy công việc Import tương ứng",
              },
            },
          },
        },
      },
    },
  },

  /**
   * ==========================================
   * BƯỚC 3: HOÀN TẤT & XỬ LÝ (COMPLETE)
   * ==========================================
   */
  [`/import/complete`]: {
    post: {
      tags: ["Import (Private)"],
      summary: "Kết thúc upload & Bắt đầu xử lý (Step 3)",
      security: [{ bearerAuth: [] }],
      responses: {
        202: { description: "Đã nhận lệnh, đang gộp file và xử lý ngầm." },
        400: {
          description: "Lỗi trạng thái Job",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "IMP_002",
                message: "Trạng thái công việc không hợp lệ để hoàn tất",
              },
            },
          },
        },
        500: {
          description: "Lỗi trích xuất",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "IMP_004",
                message: "Trích xuất dữ liệu từ tệp thất bại",
              },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  /**
   * ==========================================
   * BƯỚC 4: THEO DÕI TIẾN ĐỘ (STATUS POLLING)
   * ==========================================
   */
  [`/import/status/{jobId}`]: {
    get: {
      tags: ["Import (Private)"],
      summary: "Lấy trạng thái & Lỗi nghiệp vụ (Step 4)",
      description:
        "Truy vấn tiến độ xử lý và danh sách lỗi chi tiết theo từng dòng (QST_XXX).",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "jobId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Thông tin tiến độ hiện tại",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ImportJobStatusResponseDTO",
              },
              // Chỗ này tui liệt kê ví dụ để ông thấy cách map mã QST vào errors[]
              example: {
                success: true,
                data: {
                  jobId: "job-123",
                  status: "FAILED",
                  progress: 100,
                  metadata: {
                    totalRows: 50,
                    processedRows: 50,
                    successCount: 48,
                    errorCount: 2,
                  },
                  errors: [
                    {
                      row: 10,
                      column: "B",
                      message: "Thiếu ID chương",
                      errorCode: "QST_001",
                    },
                    {
                      row: 25,
                      column: "E",
                      message: "Chỉ được phép có duy nhất 1 đáp án đúng",
                      errorCode: "QST_102",
                    },
                  ],
                  currentStep: "VALIDATING_DATA",
                  lastError: "Phát hiện lỗi nghiệp vụ trong nội dung file.",
                },
              },
            },
          },
        },
        ...securityResponses,
      },
    },
  },
};

export const importSchemas = {
  /**
   * @description Các trạng thái của quá trình Import
   */
  ImportStatus: {
    type: "string",
    enum: ["PENDING", "UPLOADING", "PROCESSING", "COMPLETED", "FAILED"],
  },

  /**
   * @description Chi tiết lỗi xảy ra tại từng dòng trong file
   */
  ImportErrorDetail: {
    type: "object",
    properties: {
      row: { type: "integer", example: 12, description: "Vị trí dòng bị lỗi" },
      column: {
        type: "string",
        example: "B",
        description: "Vị trí cột bị lỗi",
      },
      message: { type: "string", example: "Thiếu đáp án đúng cho câu hỏi." },
      errorCode: {
        type: "string",
        example: "QST_005",
        description: "Mã lỗi nghiệp vụ tương ứng",
      },
    },
  },

  /**
   * @description Dữ liệu thống kê tiến độ
   */
  ImportProgressMetadata: {
    type: "object",
    properties: {
      totalRows: { type: "integer", example: 500 },
      processedRows: { type: "integer", example: 250 },
      successCount: { type: "integer", example: 245 },
      errorCount: { type: "integer", example: 5 },
    },
  },

  /**
   * @description Kết quả trả về sau khi Khởi tạo Job (Step 1)
   */
  ImportJobResponseDTO: {
    type: "object",
    properties: {
      jobId: { type: "string", format: "uuid" },
      fileName: { type: "string" },
      status: { $ref: "#/components/schemas/ImportStatus" },
      chunkSizeLimit: {
        type: "integer",
        description: "Giới hạn bytes mỗi chunk",
      },
      expectedChunks: { type: "integer" },
      expiresAt: { type: "string", format: "date-time" },
      message: { type: "string", nullable: true },
    },
  },

  /**
   * @description Trạng thái chi tiết để Polling (Step 4)
   */
  ImportJobStatusResponseDTO: {
    type: "object",
    properties: {
      jobId: { type: "string", format: "uuid" },
      status: { $ref: "#/components/schemas/ImportStatus" },
      progress: {
        type: "number",
        example: 75.5,
        description: "Phần trăm hoàn thành",
      },
      currentStep: { type: "string", example: "EXTRACTING_DATA" },
      metadata: { $ref: "#/components/schemas/ImportProgressMetadata" },
      errors: {
        type: "array",
        items: { $ref: "#/components/schemas/ImportErrorDetail" },
      },
      lastError: { type: "string", nullable: true },
    },
  },
};

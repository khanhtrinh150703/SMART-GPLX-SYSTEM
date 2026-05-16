/**
 * DeleteResponse: Cấu trúc dữ liệu FE nhận được khi thực hiện hành động xóa.
 */
export interface DeleteResponse {
  id: string;        // ID của bản ghi bị xóa
  type: string;      // Loại thực thể (ví dụ: QUESTION, USER, CHAPTER)
  count: number;     // Số lượng bản ghi bị ảnh hưởng
  isPermanent: boolean; // Chế độ xóa: true (Xóa cứng), false (Xóa mềm)
}
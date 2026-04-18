/**
 * Interface đại diện cho một Hạng bằng lái trong hệ thống.
 * (Interface representing a License Category in the system)
 */
export interface Chapter {
  id: string ;
  orderIndex: number;
  name: string; // Thống nhất dùng 'title'
  description: string;
  lessonCount: number;
  code: string;
  status: "active" | "draft" | "deleted";
}

/**
 * Dữ liệu đầu vào khi tạo mới hạng bằng lái.
 * (Input data for creating a new license category)
 */
export type CreateChapterRequest = Pick<
    Chapter,
    "name" | "description" | "orderIndex"
>;

/**
 * Dữ liệu đầu vào khi cập nhật hạng bằng lái.
 * (Input data for updating an existing license category)
 */
export type UpdateChapterRequest = Partial<CreateChapterRequest>;
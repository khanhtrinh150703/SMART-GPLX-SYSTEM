/**
 * @description Định nghĩa các phương thức xóa trong hệ thống.
 */
export enum DeleteType {
  HARD = 'HARD',
  SOFT = 'SOFT',
}

/**
 * @description Kết quả trả về tiêu chuẩn cho các thao tác xóa hỗn hợp.
 */
export type DeleteResponse = {
  type: DeleteType;
};
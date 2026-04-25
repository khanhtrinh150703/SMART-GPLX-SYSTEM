/**
 * Interface định nghĩa các thuộc tính của Permission.
 */
export interface IPermissionProps {
  id: string;
  name: string;
  description: string | null;
}

/**
 * @description Type dùng để tạo mới một Permission.
 * Loại bỏ các trường hệ thống để Entity tự quản lý logic khởi tạo.
 */
export type CreatePermissionProps = Omit<IPermissionProps, 'id'> & {
  description?: string | null;
};
import { REGEX } from "@/domain/constants/regex.constant";

/**
 * @description Hàm gác cổng kiểu dữ liệu (Type Guard) kiểm tra chuỗi có đúng định dạng UUID hay không
 * @param value Giá trị cần kiểm tra (unknown để đảm bảo an toàn kiểu dữ liệu)
 */
export const isUUID = (value: unknown): value is string => {
  return typeof value === 'string' && REGEX.UUID_V4_REGEX.ID.test(value);
};
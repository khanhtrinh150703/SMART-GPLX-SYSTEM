/**
 * @description Bản đồ phân cấp bằng lái xe thô (Chỉ khai báo quan hệ cha - con trực tiếp).
 * Chú thích (Translation):
 * - RAW_HIERARCHY: Phân cấp thô
 * - Record: Kiểu dữ liệu đối tượng (Key-Value)
 */
const RAW_HIERARCHY: Record<string, string[]> = {
  // Nhóm mô tô
  'A1': ['A'],
  'A': [],

  // Nhóm ô tô con và tải nhẹ
  'B': ['A1'], 
  
  // Truyền B1 sẽ ra B, A1 và A (do B đã bao gồm A1)
  'B1': ['B'],
  
  // Nhóm tải nặng và khách
  'C1': ['B'],
  'C': ['C1'],
  'D1': ['C'],
  'D2': ['D1'],
  'D': ['D2'],

  // Nhóm kéo rơ-moóc (E)
  'BE': ['B'],
  'C1E': ['C1', 'BE'],
  'CE': ['C', 'C1E'],
  'D1E': ['D1', 'CE'],
  'D2E': ['D2', 'D1E'],
  'DE': ['D', 'D2E'],
};

/**
 * @description Hàm hỗ trợ lấy toàn bộ danh sách bằng được bao hàm bằng đệ quy.
 * @param license Mã bằng lái cần kiểm tra.
 * @returns Mảng các mã bằng lái con.
 */
const getAllCovered = (license: string): string[] => {
  // Lấy danh sách con trực tiếp, nếu không có thì trả về mảng rỗng
  const children = RAW_HIERARCHY[license] || [];
  const allChildren: string[] = [...children];

  for (const child of children) {
    // Đệ quy: Tiếp tục tìm các bằng con của bằng con hiện tại
    const grandChildren = getAllCovered(child);
    allChildren.push(...grandChildren);
  }

  // Loại bỏ các phần tử trùng lặp và trả về
  return [...new Set(allChildren)];
};

/**
 * @description Hằng số phân cấp đã được tính toán sẵn để sử dụng trong ứng dụng.
 * Dữ liệu này sẽ được tính toán một lần duy nhất khi ứng dụng khởi chạy.
 */
export const LICENSE_HIERARCHY: Record<string, string[]> = Object.keys(RAW_HIERARCHY).reduce(
  (acc, key) => {
    return {
      ...acc,
      [key]: getAllCovered(key),
    };
  },
  {}
);

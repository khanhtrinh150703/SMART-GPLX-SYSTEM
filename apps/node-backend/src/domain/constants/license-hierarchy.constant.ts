/**
 * @description Định nghĩa phân cấp bằng lái xe (Chỉ khai báo cấp con trực tiếp).
 */
const RAW_HIERARCHY: Record<string, string[]> = {
  'A': ['A1'],
  'B1': ['A1'],
  'B': ['B1'],
  'C1': ['B'],
  'C': ['C1'],
  'D1': ['C'],
  'D2': ['D1'],
  'D': ['D2'],
  'BE': ['B'],
  'C1E': ['C1'],
  'CE': ['C'],
  'D1E': ['D1'],
  'D2E': ['D2'],
  'DE': ['D'],
};

/**
 * @description Hàm Helper để lấy toàn bộ danh sách bằng con một cách đệ quy.
 */
const getAllCovered = (license: string): string[] => {
  const children = RAW_HIERARCHY[license] || [];
  const allChildren = [...children];
  
  for (const child of children) {
    allChildren.push(...getAllCovered(child));
  }
  
  return [...new Set(allChildren)]; // Loại bỏ trùng lặp
};

// Export hằng số đã được tính toán sẵn để dùng cho nhanh
export const LICENSE_HIERARCHY: Record<string, string[]> = Object.keys(RAW_HIERARCHY).reduce(
  (acc, key) => ({ ...acc, [key]: getAllCovered(key) }),
  {}
);
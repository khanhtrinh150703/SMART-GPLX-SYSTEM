import { LicenseSeed } from "./interface.seed";

/**
 * @description Danh sách dữ liệu mẫu cho các hạng bằng lái xe tại Việt Nam.
 * Được sắp xếp theo thứ tự phân hạng từ mô tô đến ô tô tải/khách.
 */
export const licenses: LicenseSeed[] = [
  {
    name: 'A1',
    description: 'Mô tô 2 bánh có dung tích xi-lanh đến 125 cm3 hoặc công suất động cơ điện đến 11 kW.',
    minAge: 18,
    orderIndex: 1
  },
  {
    name: 'A',
    description: 'Mô tô 2 bánh có dung tích xi-lanh trên 125 cm3 hoặc công suất điện trên 11 kW; các loại xe hạng A1.',
    minAge: 18,
    orderIndex: 2
  },
  {
    name: 'B1',
    description: 'Mô tô 3 bánh; các loại xe quy định cho giấy phép lái xe hạng A1.',
    minAge: 18,
    orderIndex: 3
  },
  {
    name: 'B',
    description: 'Ô tô chở người đến 08 chỗ; xe ô tô tải và ô tô chuyên dùng có khối lượng đến 3.500 kg; kéo rơ moóc đến 750 kg.',
    minAge: 18,
    orderIndex: 4
  },
  {
    name: 'C1',
    description: 'Ô tô tải và chuyên dùng có khối lượng từ 3.500 kg đến 7.500 kg; kéo rơ moóc đến 750 kg; các loại xe hạng B.',
    minAge: 19,
    orderIndex: 5
  },
  {
    name: 'C',
    description: 'Ô tô tải và chuyên dùng có khối lượng trên 7.500 kg; kéo rơ moóc đến 750 kg; các loại xe hạng B và C1.',
    minAge: 21,
    orderIndex: 6
  },
  {
    name: 'D1',
    description: 'Ô tô chở người từ trên 08 chỗ đến 16 chỗ; kéo rơ moóc đến 750 kg; các loại xe hạng B, C1, C.',
    minAge: 24,
    orderIndex: 7
  },
  {
    name: 'D2',
    description: 'Ô tô chở người (kể cả xe buýt) từ trên 16 chỗ đến 29 chỗ; kéo rơ moóc đến 750 kg; các loại xe hạng B, C1, C, D1.',
    minAge: 24,
    orderIndex: 8
  },
  {
    name: 'D',
    description: 'Ô tô chở người trên 29 chỗ; xe giường nằm; kéo rơ moóc đến 750 kg; các loại xe hạng B, C1, C, D1, D2.',
    minAge: 27,
    orderIndex: 9
  },
  {
    name: 'BE',
    description: 'Các loại xe hạng B kéo rơ moóc có khối lượng trên 750 kg.',
    minAge: 18,
    orderIndex: 10
  },
  {
    name: 'C1E',
    description: 'Các loại xe hạng C1 kéo rơ moóc có khối lượng trên 750 kg.',
    minAge: 19,
    orderIndex: 11
  },
  {
    name: 'CE',
    description: 'Các loại xe hạng C kéo rơ moóc trên 750 kg; xe ô tô đầu kéo kéo sơ mi rơ moóc.',
    minAge: 24,
    orderIndex: 12
  },
  {
    name: 'D1E',
    description: 'Các loại xe hạng D1 kéo rơ moóc có khối lượng trên 750 kg.',
    minAge: 24,
    orderIndex: 13
  },
  {
    name: 'D2E',
    description: 'Các loại xe hạng D2 kéo rơ moóc có khối lượng trên 750 kg.',
    minAge: 24,
    orderIndex: 14
  },
  {
    name: 'DE',
    description: 'Các loại xe hạng D kéo rơ moóc trên 750 kg; xe ô tô chở khách nối toa.',
    minAge: 27,
    orderIndex: 15
  },
  {
    name: 'I',
    description: 'Mô tả chi tiết cho chương I.',
    minAge: 18,
    orderIndex: 16
  },
  {
    name: 'II',
    description: 'Mô tả chi tiết cho chương II.',
    minAge: 18,
    orderIndex: 17
  },
  {
    name: 'III',
    description: 'Mô tả chi tiết cho chương III.',
    minAge: 18,
    orderIndex: 18
  },
  {
    name: 'IV',
    description: 'Mô tả chi tiết cho chương IV.',
    minAge: 18,
    orderIndex: 19
  },
  {
    name: 'V',
    description: 'Mô tả chi tiết cho chương V.',
    minAge: 18,
    orderIndex: 20
  },
  {
    name: 'VI',
    description: 'Mô tả chi tiết cho chương VI.',
    minAge: 18,
    orderIndex: 21
  }
];
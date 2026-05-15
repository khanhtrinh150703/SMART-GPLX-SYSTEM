/**
 * @description Bộ công cụ xử lý số ngẫu nhiên có hạt giống
 * @author Senior Backend Engineer
 */

/**
 * @description Chuyển đổi một chuỗi ký tự thành một số hạt giống (Seed) cố định.
 * @param str Chuỗi ký tự đầu vào (thường là ID)
 * @returns Số nguyên 32-bit làm hạt giống
 */
export const stringToSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // Thuật toán băm đơn giản (Shift-Add-XOR)
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Ép kiểu về số nguyên 32-bit (32-bit integer)
  }
  return Math.abs(hash);
};

/**
 * @description Lớp tạo số giả ngẫu nhiên dựa trên hạt giống.
 */
export class SeededRandom {
  private _state: number;

  constructor(seed: number) {
    this._state = seed || 1;
  }

  /**
   * @description Tạo số ngẫu nhiên tiếp theo trong khoảng [0, 1)
   * @returns number
   */
  public next(): number {
    // Hằng số LCG tiêu chuẩn (Numerical Recipes)
    this._state = (this._state * 1664525 + 1013904223) % 4294967296;
    return this._state / 4294967296;
  }
}

/**
 * @description Tráo đổi vị trí các phần tử trong mảng dựa trên hạt giống (Fisher-Yates Shuffle).
 * @param array Mảng cần tráo đổi (kiểu Generic T)
 * @param seed Số hạt giống để đảm bảo tính xác định
 * @returns Mảng mới đã được tráo đổi (không thay đổi mảng gốc)
 */
export const shuffleWithSeed = <T>(array: readonly T[], seed: number): T[] => {
  const rng = new SeededRandom(seed);
  const result = [...array]; // Tạo bản sao để đảm bảo tính Immutability (bất biến)

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    // Sử dụng Destructuring để hoán đổi vị trí
    [result[i], result[j]] = [result[j], result[i]] as [T, T];
  }

  return result;
};
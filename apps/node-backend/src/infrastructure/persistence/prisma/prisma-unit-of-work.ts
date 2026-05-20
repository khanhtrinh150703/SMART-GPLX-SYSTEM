// @file: src/infrastructure/persistence/prisma/prisma-unit-of-work.ts
import { IUnitOfWork } from "@/domain/interfaces/seedwork";
import { PrismaClient } from "@prisma/client";

export class PrismaUnitOfWork implements IUnitOfWork {
  private readonly _prisma: PrismaClient;
  // Sử dụng biến private để lưu trữ instance của transaction client trong scope hiện tại
  private _activeTransaction: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  > | null = null;

  constructor({ prisma }: { prisma: PrismaClient }) {
    this._prisma = prisma;
  }

  /**
   * @description Trả về Transaction Client nếu đang trong transaction, ngược lại trả về Prisma gốc.
   * Trả về kiểu 'unknown' để tuân thủ thiết kế trừu tượng của Interface.
   */
  public getContext(): unknown {
    return this._activeTransaction || this._prisma;
  }

  public async runInTransaction<T>(work: () => Promise<T>): Promise<T> {
    // Nếu đã nằm trong một transaction trước đó, chạy tiếp tục trên transaction đó
    if (this._activeTransaction) {
      return work();
    }

    // Khởi tạo transaction mới từ Prisma
    return this._prisma.$transaction(async (tx) => {
      this._activeTransaction = tx;
      try {
        const result = await work();
        return result;
      } finally {
        // Dọn dẹp trạng thái sau khi transaction kết thúc (hoặc rollback)
        this._activeTransaction = null;
      }
    });
  }
}

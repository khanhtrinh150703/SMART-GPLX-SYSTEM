/**
 * @description DTO phản hồi thông tin chương lý thuyết cho Client.
 */
export interface ChapterResponseDTO {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly orderIndex: number;
  readonly createdAt: Date;
}
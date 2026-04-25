/**
 * @description Interface đại diện cho tệp tin được tải lên, thay thế hoàn toàn cho 'any' hoặc 'Express.Multer.File' ở tầng Domain.
 */
export interface IUploadFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}
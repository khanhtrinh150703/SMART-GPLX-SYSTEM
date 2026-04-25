/**
 * Interface đại diện cho file được upload (tương thích với Express.Multer.File)
 */
export interface IUpdateProfileInput {
  fullName?: string;
  pictureFile?: IUploadedFile;
}

export interface IUploadedFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  // Các trường bên dưới cho thêm dấu ? để không bắt buộc
  fieldname?: string;
  encoding?: string;
  destination?: string;
  filename?: string;
  path?: string;
}
/**
 * Interface đại diện cho file được upload (tương thích với Express.Multer.File)
 */
export interface IUpdateProfileInput {
  fullName?: string;
  pictureFile?: IUploadedFile;
}

export interface IUploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}
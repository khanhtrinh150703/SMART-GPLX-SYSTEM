import { IUploadedFile } from "@/shared/types/file.type";

export interface IFileStorageService {
  saveFile(file: IUploadedFile, folder: string): Promise<string>;
}
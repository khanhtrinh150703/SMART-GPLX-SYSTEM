export interface IImportQueue {
  addImportJob(jobId: string, zipPath: string): Promise<void>;
  close(): Promise<void>;
}
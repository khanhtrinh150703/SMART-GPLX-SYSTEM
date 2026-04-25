import { IImportQueue } from '@/domain/interfaces/queues/i-import.queue';
import { Queue } from 'bullmq';

export interface IImportJobPayload {
  jobId: string;
  zipPath: string;
}

export const IMPORT_QUEUE_NAME = 'question-import-queue';

export class ImportQueue implements IImportQueue {
  private _queue: Queue<IImportJobPayload>;

  // Chuyển thành PUBLIC để DI Container có thể khởi tạo
  // (Dịch: Change to public so the DI Container can instantiate)
  constructor() {
    this._queue = new Queue<IImportJobPayload>(IMPORT_QUEUE_NAME, {
      connection: {
        url: process.env.REDIS_URL,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000
        },
        removeOnComplete: true,
        removeOnFail: { age: 24 * 3600 },
      },
    });
  }

  public async addImportJob(jobId: string, zipPath: string): Promise<void> {
    await this._queue.add(
      'process-zip',
      { jobId, zipPath },
      { jobId: jobId }
    );
  }

  public async close(): Promise<void> {
    await this._queue.close();
  }
}
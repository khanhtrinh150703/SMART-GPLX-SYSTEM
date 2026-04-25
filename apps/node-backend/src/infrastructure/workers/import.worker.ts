import { Worker, Job } from 'bullmq';
import { IImportJobPayload, IMPORT_QUEUE_NAME } from '../queues/import.queue';
import { IImportProcessorService } from '@/domain/interfaces/services/integration/i-import-processor.service';

interface ImportWorkerDependencies {
  importProcessorService: IImportProcessorService; // Tên phải khớp 100% với tên đăng ký trong container
}

export class ImportWorker {
  private _worker: Worker<IImportJobPayload>;

  constructor({ importProcessorService}: ImportWorkerDependencies) {
    this._worker = new Worker<IImportJobPayload>(
      IMPORT_QUEUE_NAME,
      async (job: Job<IImportJobPayload>) => {
        const { jobId, zipPath } = job.data;

        // Luồng chạy ngầm bắt đầu ở đây
        // Gọi hàm xử lý logic nặng trong Service
        await importProcessorService.process(jobId, zipPath);
      },
      { connection: { url: process.env.REDIS_URL, }, concurrency: 1 }
    );

    this.setupListeners();
  }

  /**
   * @description Dừng worker và giải phóng kết nối Redis một cách an toàn.
   * (Dịch: Stops the worker and safely releases the Redis connection.)
   * @returns {Promise<void>}
   */
  public async close(): Promise<void> {
    // Graceful shutdown: Đợi các job đang xử lý dở dang hoàn tất trước khi đóng hẳn
    await this._worker.close();
  }

  private setupListeners() {
    this._worker.on('completed', (job) => console.log(`✅ Job ${job.id} xong!`));
    this._worker.on('failed', (job, err) => console.error(`❌ Job ${job?.id} lỗi: ${err.message}`));
  }
}
export const QUEUE_CONFIG = {
  concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '5', 10),
};
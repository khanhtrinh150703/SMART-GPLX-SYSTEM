import winston from 'winston';
import LokiTransport from 'winston-loki';

const logger = winston.createLogger({
  level: 'info',
  // BỎ winston.format.timestamp() ở đây để tránh xung đột
  format: winston.format.json(), 
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    }),
    new LokiTransport({
      host: 'http://127.0.0.1:3100',
      labels: { app: 'smart-gplx-system' },
      json: true,
      batching: false,
      replaceTimestamp: true, 
      onConnectionError: (err) => console.error("❌ LỖI LOKI:", err)
    })
  ]
});

export default logger;
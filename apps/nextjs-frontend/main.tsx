import { initializeFaro } from '@grafana/faro-web-sdk';

initializeFaro({
  url: 'http://localhost:3100/loki/api/v1/push', // Đẩy về Loki
  app: {
    name: 'smart-gplx-frontend',
    version: '1.0.0',
  },
});
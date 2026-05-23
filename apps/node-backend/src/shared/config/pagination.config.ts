export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: parseInt(process.env.PAGINATION_DEFAULT_PAGE || '1', 10),
  DEFAULT_LIMIT: parseInt(process.env.PAGINATION_DEFAULT_LIMIT || '10', 10),
  MAX_LIMIT: parseInt(process.env.PAGINATION_MAX_LIMIT || '100', 10),
};
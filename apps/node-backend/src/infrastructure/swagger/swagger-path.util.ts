import { API_CONFIG } from "@/shared/config/api.config";

/**
 * @description Định nghĩa cấu trúc của một Method (GET, POST,...) trong Swagger.
 * English: Definition of a Method structure in Swagger.
 */
export interface SwaggerMethod {
    tags?: string[];
    summary?: string;
    description?: string;
    operationId?: string;
    parameters?: unknown[];
    requestBody?: unknown;
    responses?: Record<string, unknown>;
    security?: Record<string, string[]>[];
}

/**
 * @description Một Path sẽ chứa nhiều Method (ví dụ /login có POST, GET).
 * English: A Path contains multiple Methods.
 */
export type SwaggerPathItem = Record<string, SwaggerMethod>;

/**
 * @description Tập hợp tất cả các Path trong hệ thống.
 * English: Collection of all Paths in the system.
 */
export type SwaggerPaths = Record<string, SwaggerPathItem>;

/**
 * @description Gắn Base URL vào các route với kiểu dữ liệu chặt chẽ.
 * English: Attach Base URL to routes with strict data types.
 */
export const applyBaseUrl = (modulePaths: SwaggerPaths): SwaggerPaths => {
    const baseUrl = API_CONFIG.BASE_URL;

    return Object.keys(modulePaths).reduce((acc, path) => {
        // Đảm bảo đường dẫn bắt đầu bằng baseUrl và xử lý triệt để lỗi lặp dấu "/"
        const fullPath = `${baseUrl}/${path}`.replace(/\/+/g, '/');
        acc[fullPath] = modulePaths[path];
        return acc;
    }, {} as SwaggerPaths);
};
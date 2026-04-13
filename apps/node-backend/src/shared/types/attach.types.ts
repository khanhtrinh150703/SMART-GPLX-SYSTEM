import request from 'supertest';

/**
 * Kiểu dữ liệu cho Payload: Một object với key là string, 
 * value có thể là chuỗi, số, boolean, object hoặc array.
 */
type MultipartPayload = Record<string, string | number | boolean | object | null | undefined>;

/**
 * Hàm hỗ trợ đính kèm dữ liệu vào request dưới dạng multipart/form-data
 * @param req - Đối tượng Request của Supertest
 * @param payload - Dữ liệu cần gửi đi
 */
export const attachMultipart = async (
    req: request.Test, 
    payload: MultipartPayload
): Promise<request.Response> => {
    for (const key in payload) {
        const value = payload[key];

        // Nếu giá trị là null hoặc undefined, chúng ta có thể bỏ qua hoặc gửi chuỗi rỗng
        if (value === null || value === undefined) continue;

        if (Array.isArray(value) || typeof value === 'object') {
            // Đối với Array hoặc Object (như mảng answers), 
            // chúng ta cần chuyển sang chuỗi JSON để gửi qua multipart
            req.field(key, JSON.stringify(value));
        } else {
            // Đối với các kiểu dữ liệu nguyên bản (string, number, boolean)
            req.field(key, String(value));
        }
    }

    return await req;
};
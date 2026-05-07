import swaggerJsdoc from "swagger-jsdoc";
import { paths } from "./paths";
import { schemas } from "./schemas";
import { commonResponses } from "./schemas/common.schemas";

const API_BASE = "/api/v1";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart GPLX API",
      version: "1.0.0",
      description: "API Documentation for Smart GPLX Management System",
    },
    servers: [{ url: API_BASE, description: "Development Server" }],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      responses: {
        ValidationError: {
          description: "Dữ liệu không hợp lệ",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        UnauthorizedError: {
          description: "Chưa xác thực hoặc token không hợp lệ",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        ConflictError: {
          description: "Dữ liệu đã tồn tại",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        TooManyRequestsError: {
          description: "Thao tác quá nhanh (cooldown)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        DeleteSuccessResponse: commonResponses.DeleteSuccessResponse,
      },
      schemas,
    },

    paths,
  },
  apis: [],
};

export const specs = swaggerJsdoc(options);

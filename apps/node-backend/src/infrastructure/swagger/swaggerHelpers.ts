// swaggerHelpers.ts
export const securityResponses = {
  401: { $ref: "#/components/schemas/UnauthorizedError" },
  403: { $ref: "#/components/schemas/ForbiddenError" },
};

export const deleteResponse = {
  200: { $ref: "#/components/responses/DeleteSuccessResponse" },
};

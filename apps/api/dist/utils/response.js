"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatedResponse = exports.errorResponse = exports.successResponse = void 0;
const successResponse = (data, message) => ({
    success: true,
    message,
    data,
});
exports.successResponse = successResponse;
const errorResponse = (error, details) => ({
    success: false,
    error,
    details,
});
exports.errorResponse = errorResponse;
const paginatedResponse = (data, pagination) => ({
    success: true,
    data,
    pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit),
    },
});
exports.paginatedResponse = paginatedResponse;
//# sourceMappingURL=response.js.map
export const successResponse = (data: any, message?: string) => ({
  success: true,
  message,
  data,
});

export const errorResponse = (error: string, details?: any) => ({
  success: false,
  error,
  details,
});

export const paginatedResponse = (
  data: any[],
  pagination: { page: number; limit: number; total: number }
) => ({
  success: true,
  data,
  pagination: {
    page: pagination.page,
    limit: pagination.limit,
    total: pagination.total,
    totalPages: Math.ceil(pagination.total / pagination.limit),
  },
});

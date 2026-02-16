export declare const successResponse: (data: any, message?: string) => {
    success: boolean;
    message: string | undefined;
    data: any;
};
export declare const errorResponse: (error: string, details?: any) => {
    success: boolean;
    error: string;
    details: any;
};
export declare const paginatedResponse: (data: any[], pagination: {
    page: number;
    limit: number;
    total: number;
}) => {
    success: boolean;
    data: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};
//# sourceMappingURL=response.d.ts.map
export declare const userService: {
    findById(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
        phone: string | null;
        emailVerified: boolean;
        createdAt: Date;
    }>;
    findAll(query: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        users: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    updateAvatar(userId: string, avatarUrl: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=userService.d.ts.map
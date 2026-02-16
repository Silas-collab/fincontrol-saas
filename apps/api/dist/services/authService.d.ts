interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
interface LoginData {
    email: string;
    password: string;
}
export declare const authService: {
    register(data: RegisterData): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            createdAt: Date;
        };
        workspace: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            type: string;
            currency: string;
            timezone: string;
            isActive: boolean;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    login(data: LoginData): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
        };
        workspaces: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            type: string;
            currency: string;
            timezone: string;
            isActive: boolean;
        }[];
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    refreshToken(userId: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
        };
        accessToken: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
        phone: string | null;
        emailVerified: boolean;
        twoFactorEnabled: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
    }>;
    updateProfile(userId: string, data: Partial<RegisterData>): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
    }>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
};
export {};
//# sourceMappingURL=authService.d.ts.map
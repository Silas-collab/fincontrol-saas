interface CreateWorkspaceData {
    name: string;
    description?: string;
    type: string;
    currency?: string;
    timezone?: string;
}
export declare const workspaceService: {
    create(userId: string, data: CreateWorkspaceData): Promise<{
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
    }>;
    findById(workspaceId: string, userId: string): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            };
        } & {
            userId: string;
            id: string;
            role: string;
            joinedAt: Date;
            invitedBy: string | null;
            workspaceId: string;
        })[];
    } & {
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
    }>;
    findByUser(userId: string): Promise<{
        role: string;
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
    }[]>;
    update(workspaceId: string, userId: string, data: Partial<CreateWorkspaceData>): Promise<{
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
    }>;
    delete(workspaceId: string, userId: string): Promise<{
        message: string;
    }>;
    inviteMember(workspaceId: string, userId: string, email: string, role: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
        };
    } & {
        userId: string;
        id: string;
        role: string;
        joinedAt: Date;
        invitedBy: string | null;
        workspaceId: string;
    }>;
    removeMember(workspaceId: string, userId: string, memberUserId: string): Promise<{
        message: string;
    }>;
};
export {};
//# sourceMappingURL=workspaceService.d.ts.map
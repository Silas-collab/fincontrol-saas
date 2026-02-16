interface CreateCategoryData {
    name: string;
    type: string;
    parentId?: string;
    color?: string;
    icon?: string;
    description?: string;
}
export declare const categoryService: {
    create(workspaceId: string, data: CreateCategoryData): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        isActive: boolean;
        workspaceId: string;
        color: string;
        icon: string;
        keywords: string;
        isSystem: boolean;
        parentId: string | null;
    }>;
    findByWorkspace(workspaceId: string): Promise<({
        parent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            type: string;
            isActive: boolean;
            workspaceId: string;
            color: string;
            icon: string;
            keywords: string;
            isSystem: boolean;
            parentId: string | null;
        } | null;
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            type: string;
            isActive: boolean;
            workspaceId: string;
            color: string;
            icon: string;
            keywords: string;
            isSystem: boolean;
            parentId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        isActive: boolean;
        workspaceId: string;
        color: string;
        icon: string;
        keywords: string;
        isSystem: boolean;
        parentId: string | null;
    })[]>;
    findById(categoryId: string, workspaceId: string): Promise<{
        parent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            type: string;
            isActive: boolean;
            workspaceId: string;
            color: string;
            icon: string;
            keywords: string;
            isSystem: boolean;
            parentId: string | null;
        } | null;
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            type: string;
            isActive: boolean;
            workspaceId: string;
            color: string;
            icon: string;
            keywords: string;
            isSystem: boolean;
            parentId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        isActive: boolean;
        workspaceId: string;
        color: string;
        icon: string;
        keywords: string;
        isSystem: boolean;
        parentId: string | null;
    }>;
    update(categoryId: string, workspaceId: string, data: Partial<CreateCategoryData>): Promise<{
        parent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            type: string;
            isActive: boolean;
            workspaceId: string;
            color: string;
            icon: string;
            keywords: string;
            isSystem: boolean;
            parentId: string | null;
        } | null;
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            type: string;
            isActive: boolean;
            workspaceId: string;
            color: string;
            icon: string;
            keywords: string;
            isSystem: boolean;
            parentId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        isActive: boolean;
        workspaceId: string;
        color: string;
        icon: string;
        keywords: string;
        isSystem: boolean;
        parentId: string | null;
    }>;
    delete(categoryId: string, workspaceId: string): Promise<{
        message: string;
    }>;
};
export {};
//# sourceMappingURL=categoryService.d.ts.map
interface CreateBudgetData {
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    totalBudgeted: number;
    alertThreshold?: number;
    categories: {
        categoryId: string;
        budgeted: number;
    }[];
}
export declare const budgetService: {
    create(workspaceId: string, data: CreateBudgetData): Promise<{
        categories: ({
            category: {
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
            };
        } & {
            id: string;
            categoryId: string;
            budgeted: number;
            spent: number;
            budgetId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        workspaceId: string;
        startDate: Date;
        endDate: Date;
        totalBudgeted: number;
        totalSpent: number;
        alertThreshold: number;
        alertSent: boolean;
    }>;
    findByWorkspace(workspaceId: string): Promise<({
        categories: ({
            category: {
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
            };
        } & {
            id: string;
            categoryId: string;
            budgeted: number;
            spent: number;
            budgetId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        workspaceId: string;
        startDate: Date;
        endDate: Date;
        totalBudgeted: number;
        totalSpent: number;
        alertThreshold: number;
        alertSent: boolean;
    })[]>;
    findById(budgetId: string, workspaceId: string): Promise<{
        categories: ({
            category: {
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
            };
        } & {
            id: string;
            categoryId: string;
            budgeted: number;
            spent: number;
            budgetId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        workspaceId: string;
        startDate: Date;
        endDate: Date;
        totalBudgeted: number;
        totalSpent: number;
        alertThreshold: number;
        alertSent: boolean;
    }>;
    update(budgetId: string, workspaceId: string, data: Partial<CreateBudgetData>): Promise<{
        categories: ({
            category: {
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
            };
        } & {
            id: string;
            categoryId: string;
            budgeted: number;
            spent: number;
            budgetId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        workspaceId: string;
        startDate: Date;
        endDate: Date;
        totalBudgeted: number;
        totalSpent: number;
        alertThreshold: number;
        alertSent: boolean;
    }>;
    delete(budgetId: string, workspaceId: string): Promise<{
        message: string;
    }>;
};
export {};
//# sourceMappingURL=budgetService.d.ts.map
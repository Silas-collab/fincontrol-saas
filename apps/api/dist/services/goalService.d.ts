interface CreateGoalData {
    name: string;
    description?: string;
    type: string;
    targetAmount: number;
    targetDate?: Date;
    icon?: string;
    color?: string;
    autoAllocate?: boolean;
    allocationPercentage?: number;
}
export declare const goalService: {
    create(workspaceId: string, data: CreateGoalData): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        workspaceId: string;
        color: string;
        icon: string;
        status: string;
        startDate: Date;
        targetAmount: number;
        currentAmount: number;
        targetDate: Date | null;
        completedAt: Date | null;
        autoAllocate: boolean;
        allocationPercentage: number | null;
    }>;
    findByWorkspace(workspaceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        workspaceId: string;
        color: string;
        icon: string;
        status: string;
        startDate: Date;
        targetAmount: number;
        currentAmount: number;
        targetDate: Date | null;
        completedAt: Date | null;
        autoAllocate: boolean;
        allocationPercentage: number | null;
    }[]>;
    findById(goalId: string, workspaceId: string): Promise<{
        contributions: {
            id: string;
            description: string | null;
            amount: number;
            contributedAt: Date;
            goalId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        workspaceId: string;
        color: string;
        icon: string;
        status: string;
        startDate: Date;
        targetAmount: number;
        currentAmount: number;
        targetDate: Date | null;
        completedAt: Date | null;
        autoAllocate: boolean;
        allocationPercentage: number | null;
    }>;
    update(goalId: string, workspaceId: string, data: Partial<CreateGoalData>): Promise<{
        contributions: {
            id: string;
            description: string | null;
            amount: number;
            contributedAt: Date;
            goalId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        workspaceId: string;
        color: string;
        icon: string;
        status: string;
        startDate: Date;
        targetAmount: number;
        currentAmount: number;
        targetDate: Date | null;
        completedAt: Date | null;
        autoAllocate: boolean;
        allocationPercentage: number | null;
    }>;
    delete(goalId: string, workspaceId: string): Promise<{
        message: string;
    }>;
    addContribution(goalId: string, workspaceId: string, amount: number, description?: string): Promise<{
        id: string;
        description: string | null;
        amount: number;
        contributedAt: Date;
        goalId: string;
    }>;
};
export {};
//# sourceMappingURL=goalService.d.ts.map
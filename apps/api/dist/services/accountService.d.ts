interface CreateAccountData {
    name: string;
    type: string;
    description?: string;
    bankName?: string;
    initialBalance?: number;
    color?: string;
    icon?: string;
}
export declare const accountService: {
    create(workspaceId: string, data: CreateAccountData): Promise<{
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
        bankName: string | null;
        bankCode: string | null;
        agency: string | null;
        accountNumber: string | null;
        initialBalance: number;
        currentBalance: number;
        creditLimit: number | null;
        closingDay: number | null;
        dueDay: number | null;
        archivedAt: Date | null;
    }>;
    findByWorkspace(workspaceId: string): Promise<{
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
        bankName: string | null;
        bankCode: string | null;
        agency: string | null;
        accountNumber: string | null;
        initialBalance: number;
        currentBalance: number;
        creditLimit: number | null;
        closingDay: number | null;
        dueDay: number | null;
        archivedAt: Date | null;
    }[]>;
    findById(accountId: string, workspaceId: string): Promise<{
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
        bankName: string | null;
        bankCode: string | null;
        agency: string | null;
        accountNumber: string | null;
        initialBalance: number;
        currentBalance: number;
        creditLimit: number | null;
        closingDay: number | null;
        dueDay: number | null;
        archivedAt: Date | null;
    }>;
    update(accountId: string, workspaceId: string, data: Partial<CreateAccountData>): Promise<{
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
        bankName: string | null;
        bankCode: string | null;
        agency: string | null;
        accountNumber: string | null;
        initialBalance: number;
        currentBalance: number;
        creditLimit: number | null;
        closingDay: number | null;
        dueDay: number | null;
        archivedAt: Date | null;
    }>;
    delete(accountId: string, workspaceId: string): Promise<{
        message: string;
    }>;
    getBalance(accountId: string, workspaceId: string): Promise<{
        accountId: string;
        currentBalance: number;
        initialBalance: number;
    }>;
};
export {};
//# sourceMappingURL=accountService.d.ts.map
export declare const dashboardService: {
    getSummary(workspaceId: string): Promise<{
        accounts: {
            total: number;
            active: number;
            totalBalance: number;
        };
        monthly: {
            income: number;
            expense: number;
            balance: number;
        };
        transactions: {
            total: number;
            recent: ({
                account: {
                    name: string;
                    color: string;
                };
                category: {
                    name: string;
                    color: string;
                    icon: string;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                type: string;
                currency: string;
                workspaceId: string;
                categoryId: string | null;
                creditCardId: string | null;
                amount: number;
                status: string;
                transactionDate: Date;
                confirmedAt: Date | null;
                recurrenceId: string | null;
                notes: string | null;
                tags: string;
                attachmentUrl: string | null;
                location: string | null;
                importId: string | null;
                rawData: string | null;
                aiConfidence: number | null;
                aiCategory: string | null;
                aiCategorizedAt: Date | null;
                aiModelVersion: string | null;
                autoRuleId: string | null;
                bankConnectionId: string | null;
                externalId: string | null;
                accountId: string;
            })[];
        };
        goals: {
            active: number;
        };
        budgets: {
            active: number;
        };
    }>;
    getMonthlyTrend(workspaceId: string, months?: number): Promise<{
        month: string;
        income: number;
        expense: number;
        balance: number;
    }[]>;
    getCategoryBreakdown(workspaceId: string, type: string): Promise<({
        amount: number;
        name?: string | undefined;
        color?: string | undefined;
        icon?: string | undefined;
    } | null)[]>;
};
//# sourceMappingURL=dashboardService.d.ts.map
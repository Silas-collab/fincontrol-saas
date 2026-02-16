import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const dashboardController: {
    getSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getMonthlyTrend(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getCategoryBreakdown(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
};
export {};
//# sourceMappingURL=dashboardController.d.ts.map
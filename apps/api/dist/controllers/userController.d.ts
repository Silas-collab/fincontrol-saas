import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const userController: {
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateAvatar(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteAccount(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
};
export {};
//# sourceMappingURL=userController.d.ts.map
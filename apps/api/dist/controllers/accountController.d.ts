import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: any;
    workspace?: any;
}
export declare const accountController: {
    create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
};
export {};
//# sourceMappingURL=accountController.d.ts.map
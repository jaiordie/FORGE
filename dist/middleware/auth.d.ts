import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AuthUser } from '../types';
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authorize: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map
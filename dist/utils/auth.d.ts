import { AuthUser } from '../types';
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
export declare const generateToken: (user: AuthUser) => string;
export declare const verifyToken: (token: string) => AuthUser;
//# sourceMappingURL=auth.d.ts.map
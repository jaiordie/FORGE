import { Request, Response } from 'express';
export declare const createJob: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPlumberJobs: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const submitQuote: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateJobStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const uploadJobPhoto: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=jobController.d.ts.map
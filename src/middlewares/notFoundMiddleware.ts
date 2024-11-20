import {  Request, Response } from 'express';
export const notFoundMiddleware = (basePath = '') => {
    return (req: Request, res: Response) => {
        res.status(404).send({
            status: 404,
            message: `Resource${basePath ? ` in ${basePath}` : ''} not found. Change URL.`,
        });
    };
};
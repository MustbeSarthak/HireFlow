// Centralized error handler
import { type Request, type Response, type NextFunction } from "express";

const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    if (err instanceof Error) {
        console.error(err.stack);

        res.status(500).json({
            status: 500,
            message: "Something went wrong",
            error: err.message,
        });

        return;
    }

    res.status(500).json({
        status: 500,
        message: "Unknown Error",
    });
};

export default errorHandler;
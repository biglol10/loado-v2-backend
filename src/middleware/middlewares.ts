// middlewares.ts
import { Request, Response, NextFunction, RequestHandler } from "express";

interface CustomRequest extends Request {
  [keyVal: string]: any;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).send(err.message || "An error occurred");
};

export const asyncHandler =
  (fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction): Promise<void> =>
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
      // err = new Error("This is another error"); // errorHandler의 err엔 이게 감
      next(err);
    });

export const logger = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  req.msg = "Logging Start";
  console.log(`${req.method} ${req.path}`);
  next();
};

export const cors = (req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
  } else {
    next();
  }
};

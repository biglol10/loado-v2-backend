// middlewares.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import ErrorLogModel from "../models/ErrorLog";
import CustomError from "../utils/CustomError";

interface CustomRequest extends Request {
  [keyVal: string]: any;
}

export const errorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    const newErrorRecord = new ErrorLogModel({
      message: err.message,
      stackTrace: err.stack,
      metadata: err.data,
    });

    await newErrorRecord.save();

    return res.status(400).json({
      message: err.message,
      data: err.data,
    });
  } else {
    const newErrorRecord = new ErrorLogModel({
      message: err.message || "Error Occured",
      stackTrace: err.stack || "Error Stack",
      metadata: {
        method: req.method,
        url: req.url,
      },
    });
    await newErrorRecord.save();

    return res.status(400).json({
      message: err.message || "Error Occured",
      data: {
        method: req.method,
        url: req.url,
      },
    });
  }
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

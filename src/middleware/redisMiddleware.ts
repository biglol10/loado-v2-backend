import { Request, Response, NextFunction } from "express";
import redisInstance from "../utils/redisInstance";

// const redisMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const cacheKey = req.originalUrl; // 예시: /api/loadoPrice/getMarketPriceByCategoryCode?categoryCode=44420

//   try {
//     const cachedData = await redisInstance.get(cacheKey);

//     console.log(`cacheKey is ${cacheKey}`);
//     console.log("cachedData is");
//     console.log(cachedData);

//     if (cachedData) {
//       res.json(JSON.parse(cachedData));
//     } else {
//       // Override the res.json method to intercept JSON responses
//       const originalJson = res.json;
//       res.json = (data) => {
//         // Cache the response data
//         redisInstance.set(cacheKey, JSON.stringify(data), { EX: 600 }); // Set expiry in seconds (e.g., 300 seconds)

//         // Call the original res.json method to send the response
//         return originalJson.call(res, data); // Return the result of the original method
//       };

//       next();
//     }
//   } catch (error) {
//     next(error);
//   }
// };

const redisMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export default redisMiddleware;

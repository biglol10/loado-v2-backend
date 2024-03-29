import { Request, Response, NextFunction } from "express";
import redisInstance from "../utils/redisInstance";

// 600ms ~ 1.16s 에서 220ms ~ 420ms로 줄어든 걸 확인할 수 있음
const redisMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const cacheKey = req.originalUrl; // 예시: /api/loadoPrice/getMarketPriceByCategoryCode?categoryCode=44420

  try {
    const cachedData = await redisInstance.get(cacheKey);

    if (cachedData) {
      res.json(JSON.parse(cachedData));
    } else {
      const originalJson = res.json;
      res.json = (data) => {
        redisInstance.set(cacheKey, JSON.stringify(data), { EX: 300 }); // Set expiry in seconds (5 min)

        return originalJson.call(res, data); // Return the result of the original method
      };

      next();
    }
  } catch (error) {
    next(error);
  }
};

export default redisMiddleware;

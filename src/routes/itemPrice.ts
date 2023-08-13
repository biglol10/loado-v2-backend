import { Router } from "express";
import {
  setLostArkMarketItemPrice,
  getCurrentMarketItemPrice,
  getCurrentAuctionItemPrice,
  getPeriodMarketItemPrice,
  getPeriodYearMonthMarketItemPrice,
  testtest,
  getMarketPriceByCategoryCode,
} from "../controllers/lostarkPrice";
import redisMiddleware from "../middleware/redisMiddleware";

const router = Router();

router.get("/lostArkMarketItemPrice", setLostArkMarketItemPrice);

router.post(
  "/currentMarketItemPrice",
  redisMiddleware,
  getCurrentMarketItemPrice
);
router.get(
  "/currentAuctionItemPrice",
  redisMiddleware,
  getCurrentAuctionItemPrice
);
router.get(
  "/getPeriodMarketItemPrice",
  redisMiddleware,
  getPeriodMarketItemPrice
);
router.get(
  "/getPeriodYearMonthMarketItemPrice",
  redisMiddleware,
  getPeriodYearMonthMarketItemPrice
);
router.get("/testtest", testtest);
router.get(
  "/getMarketPriceByCategoryCode",
  redisMiddleware,
  getMarketPriceByCategoryCode
);

export default router;

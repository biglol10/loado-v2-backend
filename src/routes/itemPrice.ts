import { Router } from "express";
import {
  setLostArkMarketItemPrice,
  getCurrentMarketItemPrice,
  getCurrentAuctionItemPrice,
  getPeriodMarketItemPrice,
  getPeriodYearMonthMarketItemPrice,
  testtest,
  getMarketPriceByCategoryCode
} from "../controllers/lostarkPrice";

const router = Router();

router.get("/lostArkMarketItemPrice", setLostArkMarketItemPrice);

router.post("/currentMarketItemPrice", getCurrentMarketItemPrice);
router.get("/currentAuctionItemPrice", getCurrentAuctionItemPrice);
router.get("/getPeriodMarketItemPrice", getPeriodMarketItemPrice);
router.get(
  "/getPeriodYearMonthMarketItemPrice",
  getPeriodYearMonthMarketItemPrice
);
router.get("/testtest", testtest);
router.get('/getMarketPriceByCategoryCode', getMarketPriceByCategoryCode);

export default router;

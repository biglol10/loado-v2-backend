import { Router } from "express";
import {
  setLostArkMarketItemPrice,
  getCurrentMarketItemPrice,
  getCurrentAuctionItemPrice,
  getPeriodMarketItemPrice,
} from "../controllers/lostarkPrice";

const router = Router();

router.get("/lostArkMarketItemPrice", setLostArkMarketItemPrice);

router.post("/currentMarketItemPrice", getCurrentMarketItemPrice);
router.get("/currentAuctionItemPrice", getCurrentAuctionItemPrice);
router.get("/getPeriodMarketItemPrice", getPeriodMarketItemPrice);

export default router;

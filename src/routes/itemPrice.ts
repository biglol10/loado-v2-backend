import { Router } from "express";
import {
  setLostArkMarketItemPrice,
  getCurrentMarketItemPrice,
  getCurrentAuctionItemPrice,
} from "../controllers/lostarkPrice";

const router = Router();

router.get("/lostArkMarketItemPrice", setLostArkMarketItemPrice);

router.post("/currentMarketItemPrice", getCurrentMarketItemPrice);
router.get("/currentAuctionItemPrice", getCurrentAuctionItemPrice);

export default router;

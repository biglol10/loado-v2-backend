import { Router } from "express";
import { setLostArkMarketItemPrice } from "@src/controllers/lostarkPrice";

const router = Router();

router.get("/lostArkMarketItem", setLostArkMarketItemPrice);

export default router;

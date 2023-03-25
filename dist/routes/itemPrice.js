"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lostarkPrice_1 = require("@src/controllers/lostarkPrice");
const router = (0, express_1.Router)();
router.get("/lostArkMarketItem", lostarkPrice_1.setLostArkMarketItemPrice);
exports.default = router;

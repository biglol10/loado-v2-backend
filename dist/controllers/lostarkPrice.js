"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLostArkMarketItemPrice = void 0;
const middlewares_1 = require("@src/middleware/middlewares");
const BaseService_1 = __importDefault(require("@src/axios/BaseService"));
const MarketItem_1 = __importDefault(require("@src/models/MarketItem"));
exports.setLostArkMarketItemPrice = (0, middlewares_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const itemRes = yield BaseService_1.default.request({
        method: "post",
        url: "/markets/items",
        data: {
            Sort: "CURRENT_MIN_PRICE",
            CategoryCode: 50000,
            ItemTier: 0,
            ItemName: "정제된 파괴강석",
            PageNo: 1,
            SortCondition: "DESC",
        },
    });
    if (itemRes.hasOwnProperty("Items")) {
        try {
            const exactItemFilter = itemRes["Items"].filter((item) => item.Name === "정제된 파괴강석");
            const exactItem = exactItemFilter[0];
            const newMarketRecord = new MarketItem_1.default({
                itemId: exactItem.Id,
                itemName: exactItem.Name,
                itemGrade: exactItem.Grade,
                yDayAvgPrice: exactItem.YDayAvgPrice,
                recentPrice: exactItem.RecentPrice,
                currentMinPrice: exactItem.CurrentMinPrice,
            });
            newMarketRecord
                .save()
                .then(() => console.log("Market Record created successfully"))
                .catch((err) => {
                console.log("Error creating Market Record:", err);
                throw new Error("Error when saving Market Record to MongoDB");
            });
            return res.status(200).json({
                result: "success",
                data: itemRes,
            });
        }
        catch (_a) {
            throw new Error("Item not found");
        }
    }
    throw new Error("Item not found");
}));

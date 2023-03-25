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
exports.saveMarketItemsPrice = void 0;
const constVariables_1 = require("@src/const/constVariables");
const BaseService_1 = __importDefault(require("@src/axios/BaseService"));
const MarketItem_1 = __importDefault(require("@src/models/MarketItem"));
const saveMarketItemsPrice = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const itemName of constVariables_1.marketItemsArr) {
        const itemRes = yield BaseService_1.default.request({
            method: "post",
            url: "/markets/items",
            data: {
                Sort: "CURRENT_MIN_PRICE",
                CategoryCode: 50000,
                ItemTier: 0,
                ItemName: itemName,
                PageNo: 1,
                SortCondition: "DESC",
            },
        });
        if (itemRes.hasOwnProperty("Items")) {
            try {
                const exactItemFilter = itemRes["Items"].filter((item) => item.Name === itemName);
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
                    .catch((err) => console.log("Error creating Market Record:", err));
            }
            catch (_a) {
                throw new Error("Item not found");
            }
        }
        else {
            throw new Error("Item not found");
        }
    }
});
exports.saveMarketItemsPrice = saveMarketItemsPrice;

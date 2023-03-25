"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const MarketItemSchema = new mongoose_1.default.Schema({
    recordId: mongoose_1.default.Schema.Types.ObjectId,
    itemId: {
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    itemGrade: String,
    yDayAvgPrice: {
        type: Number,
        required: true,
    },
    recentPrice: {
        type: Number,
        required: true,
    },
    currentMinPrice: {
        type: Number,
        required: true,
    },
    createdAt: String,
});
MarketItemSchema.pre("save", function (next) {
    const currentDate = (0, dayjs_1.default)().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
    this.createdAt = currentDate;
    next();
});
const MarketItemModel = mongoose_1.default.model("MarketItem", MarketItemSchema);
exports.default = MarketItemModel;

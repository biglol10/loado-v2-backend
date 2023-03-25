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
const AuctionInfoSchema = new mongoose_1.default.Schema({
    StartPrice: Number,
    BuyPrice: Number,
    BidPrice: Number,
    EndDate: String,
    BidCount: Number,
    BidStartPrice: Number,
    IsCompetitive: Boolean,
    TradeAllowCount: Number,
});
const AuctionItemOptions = new mongoose_1.default.Schema({
    Type: String,
    OptionName: String,
    OptionNameTripod: String,
    Value: Number,
    IsPenalty: Boolean,
    ClassName: String,
});
const AuctionItemSchema = new mongoose_1.default.Schema({
    recordId: mongoose_1.default.Schema.Types.ObjectId,
    itemName: {
        type: String,
        required: true,
    },
    itemGrade: String,
    itemTier: Number,
    itemGradeQuality: Number,
    auctionInfo: AuctionInfoSchema,
    options: [AuctionItemOptions],
    createdAt: String,
});
AuctionItemSchema.pre("save", function (next) {
    const currentDate = (0, dayjs_1.default)().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
    this.createdAt = currentDate;
    next();
});
const AuctionItemModel = mongoose_1.default.model("AuctionItem", AuctionItemSchema);
exports.default = AuctionItemModel;

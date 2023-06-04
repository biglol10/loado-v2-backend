import mongoose from "mongoose";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const AuctionInfoSchema = new mongoose.Schema({
  StartPrice: Number,
  BuyPrice: Number,
  BidPrice: Number,
  EndDate: String,
  BidCount: Number,
  BidStartPrice: Number,
  IsCompetitive: Boolean,
  TradeAllowCount: Number,
});

const AuctionItemOptions = new mongoose.Schema({
  Type: String,
  OptionName: String,
  OptionNameTripod: String,
  Value: Number,
  IsPenalty: Boolean,
  ClassName: String,
});

const AuctionItemSchema = new mongoose.Schema({
  recordId: mongoose.Schema.Types.ObjectId,
  itemName: {
    type: String,
    required: true,
  },
  itemId: {
    type: String,
  },
  itemGrade: String,
  itemTier: Number,
  itemGradeQuality: Number,
  auctionInfo: AuctionInfoSchema,
  options: [AuctionItemOptions],
  createdAt: String,
});

AuctionItemSchema.pre("save", function (next) {
  const currentDate = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  this.createdAt = currentDate;
  next();
});

const AuctionItemModel = mongoose.model("AuctionItem", AuctionItemSchema);

export default AuctionItemModel;

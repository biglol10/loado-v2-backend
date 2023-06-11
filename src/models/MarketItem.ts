import mongoose from "mongoose";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const MarketItemSchema = new mongoose.Schema({
  recordId: mongoose.Schema.Types.ObjectId,
  itemId: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  categoryCode: {
    type: Number,
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
  const currentDate = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  this.createdAt = currentDate;
  next();
});

const MarketItemModel = mongoose.model("MarketItem", MarketItemSchema);

export default MarketItemModel;

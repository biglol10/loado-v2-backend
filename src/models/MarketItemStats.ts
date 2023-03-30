import mongoose from "mongoose";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const MarketItemStatsSchema = new mongoose.Schema({
  recordId: mongoose.Schema.Types.ObjectId,
  itemName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  minCurrentMinPrice: {
    type: Number,
    required: true,
  },
  maxCurrentMinPrice: {
    type: Number,
    required: true,
  },
  avgCurrentMinPrice: {
    type: Number,
    required: true,
  },
  createdAt: String,
});

MarketItemStatsSchema.pre("save", function (next) {
  const currentDate = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  this.createdAt = currentDate;
  next();
});

const MarketItemStatsModel = mongoose.model(
  "MarketItemStats",
  MarketItemStatsSchema
);

export default MarketItemStatsModel;

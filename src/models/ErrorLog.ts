import mongoose, { Schema } from "mongoose";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const ErrorLogSchema = new mongoose.Schema({
  recordId: mongoose.Schema.Types.ObjectId,
  message: {
    type: String,
    required: true,
  },
  stackTrace: {
    type: String,
    required: false,
  },
  metadata: {
    type: Schema.Types.Mixed,
  },
  createdAt: String,
});

ErrorLogSchema.pre("save", function (next) {
  const currentDate = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  this.createdAt = currentDate;
  next();
});

const ErrorLogModel = mongoose.model("ErrorLog", ErrorLogSchema);

export default ErrorLogModel;

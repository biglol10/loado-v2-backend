import mongoose from "mongoose";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const VisitedPageSchema = new mongoose.Schema({
  pageId: String,
  date: String,
});

const UserRequestSchema = new mongoose.Schema({
  method: String,
  url: String,
  date: String,
  data: String,
});

const UserLogSchema = new mongoose.Schema({
  userAppId: {
    type: String,
    required: true,
  },
  visitedPages: [VisitedPageSchema],
  userRequests: [UserRequestSchema],
  createdAt: String,
});

UserLogSchema.pre("save", function (next) {
  const currentDate = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  this.createdAt = currentDate;
  next();
});

const UserLogModel = mongoose.model("UserLog", UserLogSchema);

export default UserLogModel;

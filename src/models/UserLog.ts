import mongoose from "mongoose";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const UserRequestSchema = new mongoose.Schema({
  method: String,
  url: String,
  data: String,
});

const UserLogSchema = new mongoose.Schema({
  userAppId: {
    type: String,
    required: true,
  },
  visitedPage: String,
  userRequest: UserRequestSchema,
  isMobile: Boolean,
  platform: String,
  createdAt: String,
});

UserLogSchema.pre("save", function (next) {
  const currentDate = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  this.createdAt = currentDate;
  next();
});

const UserLogModel = mongoose.model("UserLog", UserLogSchema);

export default UserLogModel;

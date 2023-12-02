import mongoose from "mongoose";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface VisitedPage {
  pageId: string;
  createdAt?: string;
}

interface UserRequest {
  method: string;
  url: string;
  data: string;
  isMobile: boolean;
  platform: string;
  createdAt?: string;
}

interface UserLog extends mongoose.Document {
  userAppId: string;
  visitedPages: VisitedPage[];
  userRequests: UserRequest[];
  createdAt: string;
}

const VisitedPageSchema = new mongoose.Schema<VisitedPage>({
  pageId: String,
  createdAt: String,
});

const UserRequestSchema = new mongoose.Schema<UserRequest>({
  method: String,
  url: String,
  data: String,
  isMobile: Boolean,
  platform: String,
  createdAt: String,
});

const UserLogSchema = new mongoose.Schema<UserLog>({
  userAppId: {
    type: String,
    required: true,
  },
  visitedPages: [VisitedPageSchema],
  userRequests: [UserRequestSchema],
  createdAt: String,
});

UserLogSchema.pre("save", function (next) {
  this.createdAt = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  next();
});

const UserLogModel = mongoose.model<UserLog>("UserLog", UserLogSchema);

// Function to update or create a user log
const updateUserLog = async (userAppId: string, pageId?: string, userRequest?: UserRequest) => {
  const currentDate = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");

  const update: {
    $set: { createdAt: string };
    $push?: { visitedPages?: VisitedPage; userRequests?: UserRequest };
  } = {
    $set: { createdAt: currentDate },
  };

  if (pageId) {
    const visitedPage: VisitedPage = { pageId, createdAt: currentDate };
    update.$push = { ...update.$push, visitedPages: visitedPage };
  }
  if (userRequest) {
    const userRequestWithCreatedAt = { ...userRequest, createdAt: currentDate };
    update.$push = { ...update.$push, userRequests: userRequestWithCreatedAt };
  }

  const options = {
    new: true,
    upsert: true,
  };

  return UserLogModel.findOneAndUpdate({ userAppId }, update, options);
};

export { UserLogModel, updateUserLog };

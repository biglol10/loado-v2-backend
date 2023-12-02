import { asyncHandler } from "../middleware/middlewares";
import {updateUserLog} from "../models/UserLog";

export const saveUserLog = asyncHandler(async (req, res, next) => {
  const {
    userAppId,
    visitedPage = null,
    userRequest = null,
    isMobile,
    platform
  } = req.body;

  updateUserLog(userAppId, visitedPage, {...userRequest, isMobile, platform })

  // new UserLogModel({
  //   userAppId,
  //   visitedPage,
  //   userRequest,
  //   isMobile,
  //   platform,
  // }).save();

  return res.status(200).json({
    result: "success",
  });
});

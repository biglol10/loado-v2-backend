import { asyncHandler } from "../middleware/middlewares";
import { updateUserLog } from "../models/UserLog";

export const saveUserLog = asyncHandler(async (req, res, next) => {
  const { userAppId, visitedPage = null, userRequest = null, isMobile, platform } = req.body;

  updateUserLog(userAppId, visitedPage, userRequest ? { ...userRequest, isMobile, platform } : null);

  return res.status(200).json({
    result: "success",
  });
});

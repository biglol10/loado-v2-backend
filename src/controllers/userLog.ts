import { asyncHandler } from "../middleware/middlewares";
import UserLogModel from "../models/UserLog";

export const saveUserLog = asyncHandler(async (req, res, next) => {
  const { userAppId, visitedPages, userRequests } = req.body;

  console.log(
    `userAppId is ${userAppId} and visitedPages is ${visitedPages} and userRequests is ${userRequests}`
  );

  new UserLogModel({
    userAppId,
    visitedPages,
    userRequests,
  }).save();

  return res.status(200).json({
    result: "success",
  });
});

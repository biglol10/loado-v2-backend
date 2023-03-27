import dayjs from "dayjs";
import {
  saveMarketItemsPrice,
  saveBookItemsPrice,
  saveGemItemsPrice,
} from "@src/cronJob/cronFunctions";
import ErrorLogModel from "@src/models/ErrorLog";
import CustomError from "./CustomError";

const kstJob = async () => {
  const kstTime = dayjs().tz("Asia/Seoul");

  // Check if the current time in KST is 00:00, 06:00, 12:00, or 18:00
  if (
    kstTime.hour() % 6 === 0 &&
    kstTime.minute() === 0 &&
    kstTime.second() === 0
  ) {
    try {
      // 00시엔 서버작업 때문인지 에러 발생
      if (kstTime.hour() === 0)
        await new Promise((res) => setTimeout(res, 300000));
      console.log("came to 6hour", kstTime.format());
      await saveMarketItemsPrice();
      await saveBookItemsPrice();
      await saveGemItemsPrice(); // await 안 쓰면 에러 났을 때 catch clause에 안 가는듯
    } catch (err) {
      if (err instanceof CustomError) {
        const newErrorRecord = new ErrorLogModel({
          message: err.message,
          stackTrace: err.stack,
          metadata: err.data,
        });

        newErrorRecord.save();
      } else {
        const errorObj = err as Error;
        const newErrorRecord = new ErrorLogModel({
          message: errorObj.message || "Error Occured",
          stackTrace: errorObj.stack || "Error Stack",
        });
        newErrorRecord.save();
      }
    }
  }
};

export { kstJob };

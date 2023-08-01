import dayjs from "dayjs";
import {
  saveMarketItemsPrice,
  saveBookItemsPrice,
  saveGemItemsPrice,
  calcMarketItemsStats,
  calcBookItemsStats,
  calcAuctionItemsStats,
} from "../cronJob/cronFunctions";
import ErrorLogModel from "../models/ErrorLog";
import CustomError from "./CustomError";

const kstJob = async () => {
  const kstTime = dayjs().tz("Asia/Seoul");

  if (process.env.NODE_ENV === "development") return;

  // Check if the current time in KST is 00:00, 06:00, 12:00, or 18:00
  if (
    ((kstTime.hour() === 6 || kstTime.hour() === 12 || kstTime.hour() === 18) &&
      kstTime.minute() === 0 &&
      kstTime.second() === 0) ||
    (kstTime.hour() === 0 && kstTime.minute() === 30 && kstTime.second() === 0)
  ) {
    try {
      // // 00시엔 서버작업 때문인지 에러 발생
      // if (kstTime.hour() === 0)
      //   await new Promise((res) => setTimeout(res, 1800000));

      await saveMarketItemsPrice();
      const bookNameArr = await saveBookItemsPrice();
      await saveGemItemsPrice(); // await 안 쓰면 에러 났을 때 catch clause에 안 가는듯

      // aggregate 작업 (반정규화)
      await calcMarketItemsStats();
      await calcBookItemsStats(bookNameArr);
      await calcAuctionItemsStats();
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

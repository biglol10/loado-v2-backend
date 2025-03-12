import dayjs from "dayjs";
import {
  saveMarketItemsPrice,
  saveBookItemsPrice,
  saveGemItemsPrice,
  calcMarketItemsStats,
  calcBookItemsStats,
  calcAuctionItemsStats,
  saveRelicBookItemsPrice,
  saveT4MarketItemsPrice,
  saveT4GemItemsPrice,
  calcT4AuctionItemsStats,
} from "../cronJob/cronFunctions";
import ErrorLogModel from "../models/ErrorLog";
import CustomError from "./CustomError";
import MarketItemStatsModel from "../models/MarketItemStats";
import redisInstance from "./redisInstance";

const kstJob = async () => {
  const kstTime = dayjs().tz("Asia/Seoul");

  console.log('came to kstJob');

  if (process.env.NODE_ENV === "development") return;

  console.log('came to kstJob 2');

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

      console.log('came to actual kstJob');

      await saveMarketItemsPrice();
      await saveT4MarketItemsPrice(); // 티4 재료 정보 저장
      const bookNameArr = await saveBookItemsPrice();
      const relicBookNameArr = await saveRelicBookItemsPrice(); // 유물 각인서
      await saveGemItemsPrice(); // await 안 쓰면 에러 났을 때 catch clause에 안 가는듯
      await saveT4GemItemsPrice();

      // aggregate 작업 (반정규화)
      await calcMarketItemsStats(); // 티3, 티4 둘다 있음
      await calcBookItemsStats(bookNameArr);
      await calcBookItemsStats(relicBookNameArr);
      await calcAuctionItemsStats();
      await calcT4AuctionItemsStats(); // 티4 보석 계산

      // aggregate 작업이 끝난 후 api 캐싱 삭제
      redisInstance.flushAll();
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

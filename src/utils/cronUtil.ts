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
import MarketItemStatsModel from "../models/MarketItemStats";
import redisInstance from "./redisInstance";

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

      // aggregate 작업이 끝난 후 api 캐싱 적용
      await cacheDataAfterCron();
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

const cacheDataAfterCron = async () => {
  const categoryCodes = [
    "44410",
    "44420",
    "50010",
    "50020",
    "51000",
    "51100",
    "210000",
  ];

  const latestStats = await MarketItemStatsModel.findOne()
    .sort({ date: -1 })
    .exec();

  const latestDate = latestStats?.date;

  for (let categoryCode in categoryCodes) {
    const data = await MarketItemStatsModel.find({
      categoryCode: Number(categoryCode),
      date: latestDate || dayjs().format("YYYY-MM-DD"),
    }).limit(20);

    redisInstance.set(
      `/api/loadoPrice/getMarketPriceByCategoryCode?categoryCode=${categoryCode}`,
      JSON.stringify(data),
      { EX: 18000 }
    );
  }
};

export { kstJob };

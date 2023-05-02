import { marketItemsArr, auctionItemsArr } from "../const/constVariables";
import BaseService from "../axios/BaseService";
import MarketItemModel from "../models/MarketItem";
import AuctionItemModel from "../models/AuctionItem";
import CustomError from "../utils/CustomError";
import MarketItemStatsModel from "../models/MarketItemStats";
import dayjs from "dayjs";

interface MarketItemRecordObj {
  Id: Number;
  Name: String;
  Grade: String;
  YDayAvgPrice: Number;
  RecentPrice: Number;
  CurrentMinPrice: Number;
}

interface IAuctionInfo {
  StartPrice: Number;
  BuyPrice: Number;
  BidPrice: Number;
  EndDate: String;
  BidCount: Number;
  BidStartPrice: Number;
  IsCompetitive: Boolean;
  TradeAllowCount: Number;
}

interface IOptions {
  Type: String;
  OptionName: String;
  OptionNameTripod: String;
  Value: Number;
  IsPenalty: Boolean;
  ClassName: String;
}

interface AuctionItemRecordObj {
  Name: String;
  Grade: String;
  Tier: Number;
  GradeQuality: Number;
  AuctionInfo: IAuctionInfo;
  Options: [IOptions];
}

const saveMarketItemsPrice = async () => {
  for (const itemName of marketItemsArr) {
    const itemRes = await BaseService.request({
      method: "post",
      url: "/markets/items",
      data: {
        Sort: "CURRENT_MIN_PRICE",
        CategoryCode: 50000,
        ItemTier: 0,
        ItemName: itemName,
        PageNo: 1,
        SortCondition: "DESC",
      },
    });

    if (itemRes.hasOwnProperty("Items")) {
      try {
        const exactItemFilter = itemRes["Items"].filter(
          (item: any) => item.Name === itemName
        );

        const exactItem: MarketItemRecordObj = exactItemFilter[0];

        const newMarketRecord = new MarketItemModel({
          itemId: exactItem.Id,
          itemName: exactItem.Name,
          itemGrade: exactItem.Grade,
          yDayAvgPrice: exactItem.YDayAvgPrice,
          recentPrice: exactItem.RecentPrice,
          currentMinPrice: exactItem.CurrentMinPrice,
        });

        await newMarketRecord.save();
      } catch {
        throw new CustomError(
          "[saveMarketItemsPrice] something wrong inside hasOwnProperty",
          {
            itemResItems: itemRes,
            origin: "[saveMarketItemsPrice]",
          }
        );
      }
    } else {
      throw new CustomError(
        "[saveMarketItemsPrice] Items property does not exist",
        {
          itemResItems: itemRes,
          itemName,
          origin: "[saveBookItemsPrice]",
        }
      );
    }
  }
};

const saveBookItemsPrice = async () => {
  const bookNameArr = [];
  for (let pageNo = 1; pageNo <= 5; pageNo++) {
    const itemRes = await BaseService.request({
      method: "post",
      url: "/markets/items",
      data: {
        Sort: "CURRENT_MIN_PRICE",
        CategoryCode: 40000,
        ItemTier: 0,
        ItemName: "각인서",
        ItemGrade: "전설",
        PageNo: pageNo,
        SortCondition: "DESC",
      },
    });

    if (itemRes.hasOwnProperty("Items")) {
      try {
        const bookItemsArr = itemRes["Items"];

        for (let bookItem of bookItemsArr) {
          bookNameArr.push(bookItem.Name);
          const newBookRecord = new MarketItemModel({
            itemId: bookItem.Id,
            itemName: bookItem.Name,
            itemGrade: bookItem.Grade,
            yDayAvgPrice: bookItem.YDayAvgPrice,
            recentPrice: bookItem.RecentPrice,
            currentMinPrice: bookItem.CurrentMinPrice,
          });

          await newBookRecord.save();
        }
      } catch {
        throw new CustomError(
          "[saveBookItemsPrice] something wrong inside hasOwnProperty",
          {
            itemResItems: itemRes,
            origin: "[saveBookItemsPrice]",
          }
        );
      }
    } else {
      throw new CustomError(
        "[saveBookItemsPrice] Items property does not exist",
        {
          itemResItems: itemRes,
          pageNo,
          origin: "[saveBookItemsPrice]",
        }
      );
    }
  }
  return bookNameArr;
};

const saveGemItemsPrice = async () => {
  for (const gemName of auctionItemsArr) {
    const itemRes = await BaseService.request({
      method: "post",
      url: "/auctions/items",
      data: {
        ItemLevelMin: 0,
        ItemLevelMax: 1700,
        ItemGradeQuality: 0,
        Sort: "BUY_PRICE",
        CategoryCode: 210000,
        ItemTier: 3,
        ItemGrade: gemName.includes("10레벨") ? "유물" : "전설",
        ItemName: gemName,
        PageNo: 1,
        SortCondition: "ASC",
      },
    });

    if (itemRes.hasOwnProperty("Items")) {
      try {
        const extractOneGem: AuctionItemRecordObj = itemRes["Items"][0];

        const newAuctionRecord = new AuctionItemModel({
          itemName: extractOneGem.Name,
          itemGrade: extractOneGem.Grade,
          itemTier: extractOneGem.Tier,
          itemGradeQuality: extractOneGem.GradeQuality,
          auctionInfo: { ...extractOneGem.AuctionInfo },
          options: [...extractOneGem.Options],
        });

        await newAuctionRecord.save();
      } catch {
        throw new CustomError(
          "[saveGemItemsPrice] something wrong inside hasOwnProperty",
          {
            itemResItems: itemRes,
            origin: "[saveGemItemsPrice]",
          }
        );
      }
    } else {
      throw new CustomError(
        "[saveGemItemsPrice] Items property does not exist",
        {
          itemResItems: itemRes,
          gemName,
          origin: "[saveGemItemsPrice]",
        }
      );
    }
  }
};

const calcMarketItemsStats = async () => {
  try {
    for (const itemName of marketItemsArr) {
      const currentDate = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD");
      const stats = await MarketItemModel.aggregate([
        {
          $match: {
            itemName: itemName,
            createdAt: { $gte: currentDate },
          },
        },
        {
          $group: {
            _id: "$itemName",
            minItemPrice: { $min: "$currentMinPrice" },
            maxItemPrice: { $max: "$currentMinPrice" },
            avgItemPrice: { $avg: "$currentMinPrice" },
          },
        },
      ]);

      if (stats.length > 0) {
        const itemStats = stats[0];

        // Update or create a new MarketItemStats record
        await MarketItemStatsModel.findOneAndUpdate(
          { itemName: itemStats._id, date: currentDate },
          {
            itemName: itemStats._id,
            date: currentDate,
            minCurrentMinPrice: itemStats.minItemPrice,
            maxCurrentMinPrice: itemStats.maxItemPrice,
            avgCurrentMinPrice: itemStats.avgItemPrice,
          },
          { upsert: true }
        );
      }
    }
  } catch {
    throw new CustomError("[calcMarketItemsStats] error when aggregating", {
      origin: "[calcMarketItemsStats]",
    });
  }
};

const calcBookItemsStats = async (bookNameArr: string[]) => {
  try {
    for (const bookName of bookNameArr) {
      const currentDate = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD");
      const stats = await MarketItemModel.aggregate([
        {
          $match: {
            itemName: bookName,
            createdAt: { $gte: currentDate },
          },
        },
        {
          $group: {
            _id: {
              day: { $dayOfMonth: "$date" },
              month: { $month: "$date" },
              year: { $year: "$date" },
              itemName: "$itemName",
            },
            minItemPrice: { $min: "$currentMinPrice" },
            maxItemPrice: { $max: "$currentMinPrice" },
            avgItemPrice: { $avg: "$currentMinPrice" },
          },
        },
        {
          $project: {
            _id: 0,
            itemName: "$_id.itemName",
            formattedDate: 1,
            avgItemPrice: 1,
            minItemPrice: 1,
            maxItemPrice: 1,
          },
        },
      ]);

      if (stats.length > 0) {
        const itemStats = stats[0];

        await MarketItemStatsModel.findOneAndUpdate(
          { itemName: itemStats.itemName, date: currentDate },
          {
            itemName: itemStats.itemName,
            date: currentDate,
            minCurrentMinPrice: itemStats.minItemPrice,
            maxCurrentMinPrice: itemStats.maxItemPrice,
            avgCurrentMinPrice: itemStats.avgItemPrice,
          },
          { upsert: true }
        );
      }
    }
  } catch {
    throw new CustomError("[calcBookItemsStats] error when aggregating", {
      origin: "[calcBookItemsStats]",
    });
  }
};

const calcAuctionItemsStats = async () => {
  try {
    for (const gemName of auctionItemsArr) {
      const startDate = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD");
      const endDate = dayjs()
        .tz("Asia/Seoul")
        .add(1, "day")
        .format("YYYY-MM-DD");
      const aggregatedData = await AuctionItemModel.aggregate([
        {
          $addFields: {
            date: {
              $dateFromString: {
                dateString: "$createdAt",
              },
            },
          },
        },
        {
          $match: {
            itemName: gemName,
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: "$itemName",
            avgBuyPrice: { $avg: "$auctionInfo.BuyPrice" },
            minBuyPrice: { $min: "$auctionInfo.BuyPrice" },
            maxBuyPrice: { $max: "$auctionInfo.BuyPrice" },
          },
        },
        {
          $project: {
            _id: 0,
            itemName: "$_id",
            avgBuyPrice: 1,
            minBuyPrice: 1,
            maxBuyPrice: 1,
          },
        },
      ]);

      if (aggregatedData.length > 0) {
        const { avgBuyPrice, minBuyPrice, maxBuyPrice, itemName } =
          aggregatedData[0];

        // Update or create a new MarketItemStatsModel record
        await MarketItemStatsModel.findOneAndUpdate(
          { itemName, date: startDate },
          {
            itemName: gemName,
            avgCurrentMinPrice: avgBuyPrice,
            minCurrentMinPrice: minBuyPrice,
            maxCurrentMinPrice: maxBuyPrice,
            date: startDate,
          },
          {
            upsert: true,
          }
        );
      }
    }
  } catch {
    throw new CustomError("[calcAuctionItemsStats] error when aggregating", {
      origin: "[calcAuctionItemsStats]",
    });
  }
};

export {
  saveMarketItemsPrice,
  saveBookItemsPrice,
  saveGemItemsPrice,
  calcMarketItemsStats,
  calcBookItemsStats,
  calcAuctionItemsStats,
};

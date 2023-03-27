import { marketItemsArr, auctionItemsArr } from "@src/const/constVariables";
import BaseService from "@src/axios/BaseService";
import MarketItemModel from "@src/models/MarketItem";
import AuctionItemModel from "@src/models/AuctionItem";
import CustomError from "@src/utils/CustomError";

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
        throw new CustomError("something wrong inside hasOwnProperty", {
          itemResItems: itemRes["Items"],
          origin: "[saveMarketItemsPrice]",
        });
      }
    } else {
      throw new CustomError("Items property does not exist", {
        itemResItems: itemRes,
        itemName,
        origin: "[saveBookItemsPrice]",
      });
    }
  }
};

const saveBookItemsPrice = async () => {
  for (let pageNo = 1; pageNo <= 3; pageNo++) {
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

        // bookItemsArr.map(async (bookItem: MarketItemRecordObj) => {
        //   const newBookRecord = new MarketItemModel({
        //     itemId: bookItem.Id,
        //     itemName: bookItem.Name,
        //     itemGrade: bookItem.Grade,
        //     yDayAvgPrice: bookItem.YDayAvgPrice,
        //     recentPrice: bookItem.RecentPrice,
        //     currentMinPrice: bookItem.CurrentMinPrice,
        //   });

        //   await newBookRecord.save();
        // });
      } catch {
        throw new CustomError("something wrong inside hasOwnProperty", {
          itemResItems: itemRes["Items"],
          origin: "[saveBookItemsPrice]",
        });
      }
    } else {
      throw new CustomError("Items property does not exist", {
        itemResItems: itemRes,
        pageNo,
        origin: "[saveBookItemsPrice]",
      });
    }
  }
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
        throw new CustomError("something wrong inside hasOwnProperty", {
          itemResItems: itemRes["Items"],
          origin: "[saveGemItemsPrice]",
        });
      }
    } else {
      throw new CustomError("Items property does not exist", {
        itemResItems: itemRes,
        gemName,
        origin: "[saveGemItemsPrice]",
      });
    }
  }
};

export { saveMarketItemsPrice, saveBookItemsPrice, saveGemItemsPrice };

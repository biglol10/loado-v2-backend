import { marketItemsArr, auctionItemsArr } from "@src/const/constVariables";
import BaseService from "@src/axios/BaseService";
import MarketItemModel from "@src/models/MarketItem";
import AuctionItemModel from "@src/models/AuctionItem";

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

        newMarketRecord
          .save()
          .then(() => console.log("Market Record created successfully"))
          .catch((err) => console.log("Error creating Market Record:", err));
      } catch {
        throw new Error("Item not found");
      }
    } else {
      throw new Error("Item not found");
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

        bookItemsArr.map((bookItem: MarketItemRecordObj) => {
          const newBookRecord = new MarketItemModel({
            itemId: bookItem.Id,
            itemName: bookItem.Name,
            itemGrade: bookItem.Grade,
            yDayAvgPrice: bookItem.YDayAvgPrice,
            recentPrice: bookItem.RecentPrice,
            currentMinPrice: bookItem.CurrentMinPrice,
          });

          newBookRecord
            .save()
            .then(() => console.log("Market Record created successfully"))
            .catch((err) => console.log("Error creating Market Record:", err));
        });
      } catch {
        throw new Error("Item not found");
      }
    } else {
      throw new Error("Item not found");
    }
  }
};

const saveGemItemsPrice = async () => {
  for (const gemName of auctionItemsArr) {
    const itemRes = await BaseService.request({
      method: "post",
      url: "/markets/items",
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

        newAuctionRecord
          .save()
          .then(() => console.log("Auction Record created successfully"))
          .catch((err) => console.log("Error creating Auction Record:", err));
      } catch {
        throw new Error("Auction Item not found");
      }
    } else {
      throw new Error("Auction Item not found");
    }
  }
};

export { saveMarketItemsPrice, saveBookItemsPrice, saveGemItemsPrice };

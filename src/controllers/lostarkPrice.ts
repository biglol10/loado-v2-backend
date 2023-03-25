import { asyncHandler } from "@src/middleware/middlewares";
import BaseService from "@src/axios/BaseService";
import MarketItemModel from "@src/models/MarketItem";

export const setLostArkMarketItemPrice = asyncHandler(
  async (req, res, next) => {
    const itemRes = await BaseService.request({
      method: "post",
      url: "/markets/items",
      data: {
        Sort: "CURRENT_MIN_PRICE",
        CategoryCode: 50000,
        ItemTier: 0,
        ItemName: "정제된 파괴강석",
        PageNo: 1,
        SortCondition: "DESC",
      },
    });

    if (itemRes.hasOwnProperty("Items")) {
      try {
        const exactItemFilter = itemRes["Items"].filter(
          (item: any) => item.Name === "정제된 파괴강석"
        );

        const exactItem = exactItemFilter[0];

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
          .catch((err) => {
            console.log("Error creating Market Record:", err);
            throw new Error("Error when saving Market Record to MongoDB");
          });

        return res.status(200).json({
          result: "success",
          data: itemRes,
        });
      } catch {
        throw new Error("Item not found");
      }
    }

    throw new Error("Item not found");
  }
);

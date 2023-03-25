import { marketItemsArr } from "@src/const/constVariables";
import BaseService from "@src/axios/BaseService";
import MarketItemModel from "@src/models/MarketItem";

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
          .catch((err) => console.log("Error creating Market Record:", err));
      } catch {
        throw new Error("Item not found");
      }
    } else {
      throw new Error("Item not found");
    }
  }
};

export { saveMarketItemsPrice };

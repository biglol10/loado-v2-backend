import { asyncHandler } from "../middleware/middlewares";
import BaseService from "../axios/BaseService";
import MarketItemModel from "../models/MarketItem";
import dayjs from "dayjs";
import AuctionItemModel from "../models/AuctionItem";
import MarketItemStatsModel from "../models/MarketItemStats";
import { extractNumber } from "../utils/customFunc";

export const getLostArkMarketItemPrice = asyncHandler(
  async (req, res, next) => {}
);

export const getCurrentMarketItemPrice = asyncHandler(
  async (req, res, next) => {
    const itemList = req.body.itemList as string[];

    const resultArr = [];

    for (let itemName of itemList) {
      const itemPriceResult = await MarketItemModel.findOne({
        itemName,
      })
        .select("-_id itemId itemName currentMinPrice")
        .sort({ createdAt: -1 });

      resultArr.push(itemPriceResult);
    }

    return res.status(200).json({
      result: "success",
      resultArr,
    });
  }
);

export const getPeriodMarketItemPrice = asyncHandler(async (req, res, next) => {
  const { itemName, startDate, endDate } = req.query;

  const data = await MarketItemStatsModel.find({
    itemName: itemName,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  return res.status(200).json({
    result: "success",
    data,
  });
});

export const getPeriodYearMonthMarketItemPrice = asyncHandler(
  async (req, res, next) => {
    const { itemName, year, month, startDate, endDate } = req.query;

    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;

    // Check if year and month values are provided
    if (year && month) {
      const parsedYear = parseInt(year as string);
      const parsedMonth = parseInt(month as string);
      if (!isNaN(parsedYear) && !isNaN(parsedMonth)) {
        parsedStartDate = new Date(parsedYear, parsedMonth - 1, 1);
        parsedEndDate = new Date(parsedYear, parsedMonth, 0, 23, 59, 59, 999);
      }
    }

    const data = await MarketItemStatsModel.find({
      itemName: itemName as string,
      date: {
        $gte: dayjs(parsedStartDate).format("YYYY-MM-DD") || startDate,
        $lte: dayjs(parsedEndDate).format("YYYY-MM-DD") || endDate,
      },
    });

    return res.status(200).json({
      result: "success",
      data,
    });
  }
);

export const testtest = asyncHandler(async (req, res, next) => {
  const data1 = await MarketItemStatsModel.find({ date: "2023-03-30" });

  for (let index = 0; index < data1.length; index++) {
    const itemName = data1[index].itemName;
    if (!data1[index].itemName.includes("보석")) {
      const singleRecord = await MarketItemModel.findOne({
        itemName: data1[index].itemName,
      });
      if (singleRecord?.itemId) {
        const result = await MarketItemStatsModel.updateMany(
          {
            itemName: data1[index].itemName,
          },
          { itemId: singleRecord.itemId }
        );
      }
    } else {
      const singleRecord = await AuctionItemModel.findOne({
        itemName: data1[index].itemName,
      });

      if (singleRecord?.itemName) {
        const result = await AuctionItemModel.updateMany(
          {
            itemName,
          },
          {
            itemId: `gem${extractNumber(itemName)}_${
              itemName.includes("멸화") ? "D" : "C"
            }_66666666`,
          }
        );
      }
    }
  }

  return res.status(200).json({
    result: "success",
  });
});

// export const getCurrentMarketItemPrice = asyncHandler(
//   async (req, res, next) => {
//     const startDate = "2023-03-26";
//     const endDate = dayjs("2023-03-28").add(1, "day").format("YYYY-MM-DD");

//     const model = await MarketItemModel.aggregate([
//       {
//         $addFields: {
//           date: {
//             $dateFromString: {
//               dateString: "$createdAt",
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           date: {
//             $gte: new Date(startDate),
//             $lte: new Date(endDate),
//           },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             day: { $dayOfMonth: "$date" },
//             month: { $month: "$date" },
//             year: { $year: "$date" },
//             itemName: "$itemName",
//           },
//           avgCurrentMinPrice: { $avg: "$currentMinPrice" },
//           minCurrentMinPrice: { $min: "$currentMinPrice" },
//           maxCurrentMinPrice: { $max: "$currentMinPrice" },
//         },
//       },
//       {
//         $addFields: {
//           formattedDate: {
//             $dateToString: {
//               format: "%Y-%m-%d",
//               date: {
//                 $dateFromParts: {
//                   year: "$_id.year",
//                   month: "$_id.month",
//                   day: "$_id.day",
//                 },
//               },
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           itemName: "$_id.itemName",
//           formattedDate: 1,
//           avgCurrentMinPrice: 1,
//           minCurrentMinPrice: 1,
//           maxCurrentMinPrice: 1,
//         },
//       },
//       {
//         $sort: { formattedDate: 1, itemName: 1 },
//       },
//     ])
//       .then((result) => {
//         return res.status(200).json({
//           result: "success",
//           data: result,
//         });
//       })
//       .catch((err) => {
//         return res.status(400).json({
//           result: "success",
//           err,
//         });
//       });
//   }
// );

export const getCurrentAuctionItemPrice = asyncHandler(
  async (req, res, next) => {
    const startDate = "2023-04-01";
    const endDate = dayjs("2023-04-28").add(1, "day").format("YYYY-MM-DD");

    const model = await AuctionItemModel.aggregate([
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
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
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
          avgBuyPrice: { $avg: "$auctionInfo.BuyPrice" },
          minBuyPrice: { $min: "$auctionInfo.BuyPrice" },
          maxBuyPrice: { $max: "$auctionInfo.BuyPrice" },
        },
      },
      {
        $addFields: {
          formattedDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          itemName: "$_id.itemName",
          formattedDate: 1,
          avgBuyPrice: 1,
          minBuyPrice: 1,
          maxBuyPrice: 1,
        },
      },
      {
        $sort: { formattedDate: 1, itemName: 1 },
      },
    ])
      .then((result) => {
        return res.status(200).json({
          result: "success",
          data: result,
          day: dayjs().tz("Asia/Seoul").subtract(1, "day").format("YYYY-MM-DD"),
        });
      })
      .catch((err) => {
        return res.status(400).json({
          result: "success",
          err,
        });
      });
  }
);

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

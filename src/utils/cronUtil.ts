import dayjs from "dayjs";
import {
  saveMarketItemsPrice,
  saveBookItemsPrice,
  saveGemItemsPrice,
} from "@src/cronJob/cronFunctions";

const kstJob = () => {
  const kstTime = dayjs().tz("Asia/Seoul");

  // // Check if the current time in KST is 00:00, 06:00, 12:00, or 18:00
  // if (
  //   kstTime.hour() % 6 === 0 &&
  //   kstTime.minute() === 0 &&
  //   kstTime.second() === 0
  // ) {
  //   console.log("Running job at KST", kstTime.format());
  //   saveMarketItemsPrice();
  //   saveBookItemsPrice();
  // }

  console.log("Running job at KST", kstTime.format());
  saveMarketItemsPrice();
  saveBookItemsPrice();
  saveGemItemsPrice();
};

export { kstJob };

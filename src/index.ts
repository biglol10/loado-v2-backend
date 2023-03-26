import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import cron from "node-cron";
import { errorHandler } from "./middleware/middlewares";
// import lostArkItemPriceRoute from "./routes/itemPrice";
import connectDB from "./db/mongoDB";
import { kstJob } from "./utils/cronUtil";

dayjs.extend(utc);
dayjs.extend(timezone);

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

connectDB();

// Middleware to parse JSON request body
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// app.use("/api/lostArkItemPrice", lostArkItemPriceRoute);

// Sample route
// this should be below the routes or it will cause error
app.get("/", (req, res) => {
  res.send("Hello, your Express server with MongoDB is working!");
});

// this should be below controller to use
app.use(errorHandler);

// saveMarketItemsPrice();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// cron.schedule("* * * * *", kstJob);
// 18 = 새벽 3시, 16 = 새벽1시, 21 = 아침6시, 3 = 12시, 9 = 18시
cron.schedule("0 3,9,16,21 1-31 * *", kstJob);

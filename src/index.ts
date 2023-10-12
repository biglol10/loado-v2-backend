import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import cron from "node-cron";
import http from "http";
import { errorHandler } from "./middleware/middlewares";
import lostArkItemPriceRoute from "./routes/itemPrice";
import connectDB from "./db/mongoDB";
import { kstJob } from "./utils/cronUtil";

dayjs.extend(utc);
dayjs.extend(timezone);

const app = express();
const port = process.env.PORT || 8090;

dotenv.config();

connectDB();

// Middleware to parse JSON request body
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "https://loado-v2.vercel.app",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/loadoPrice", lostArkItemPriceRoute);

// Sample route
// this should be below the routes or it will cause error
app.get("/", (req, res) => {
  res.send("Hello, your Express server with MongoDB is working!");
});

// this should be below controller to use
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`node_env is ${process.env.NODE_ENV}`);
});

// cron.schedule("* * * * *", kstJob);
cron.schedule("* * * * *", kstJob);

// app Eco dyno로 변경 후 sleep 방지하기 위함
cron.schedule("*/25 * * * *", () => {
  http.get(
    "https://loadov2backend-a6fed76ac691.herokuapp.com/api/loadoPrice/getPeriodYearMonthMarketItemPrice?itemId=66150010&year=2023&month=4"
  );
});

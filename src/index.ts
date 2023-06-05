import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import cron from "node-cron";
import { errorHandler } from "./middleware/middlewares";
import lostArkItemPriceRoute from "./routes/itemPrice";
import connectDB from "./db/mongoDB";
import { kstJob } from "./utils/cronUtil";

dayjs.extend(utc);
dayjs.extend(timezone);

const app = express();
const port = process.env.PORT || 8080;

dotenv.config();

connectDB();

// Middleware to parse JSON request body
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "https://your-vercel-frontend-domain.com",
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const node_cron_1 = __importDefault(require("node-cron"));
const middlewares_1 = require("./middleware/middlewares");
const itemPrice_1 = __importDefault(require("./routes/itemPrice"));
const mongoDB_1 = __importDefault(require("./db/mongoDB"));
const cronUtil_1 = require("./utils/cronUtil");
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
dotenv_1.default.config();
(0, mongoDB_1.default)();
// Middleware to parse JSON request body
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use("/api/lostArkItemPrice", itemPrice_1.default);
// Sample route
// this should be below the routes or it will cause error
app.get("/", (req, res) => {
    res.send("Hello, your Express server with MongoDB is working!");
});
// this should be below controller to use
app.use(middlewares_1.errorHandler);
// saveMarketItemsPrice();
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
node_cron_1.default.schedule("* * * * *", cronUtil_1.kstJob);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kstJob = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const cronFunctions_1 = require("@src/cronJob/cronFunctions");
const kstJob = () => {
    const kstTime = (0, dayjs_1.default)().tz("Asia/Seoul");
    // Check if the current time in KST is 00:00, 06:00, 12:00, or 18:00
    if (kstTime.hour() % 6 === 0 &&
        kstTime.minute() === 0 &&
        kstTime.second() === 0) {
        console.log("Running job at KST", kstTime.format());
        (0, cronFunctions_1.saveMarketItemsPrice)();
    }
};
exports.kstJob = kstJob;

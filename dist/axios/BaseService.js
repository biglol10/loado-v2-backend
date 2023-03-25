"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AxiosInstance_1 = __importDefault(require("./AxiosInstance"));
const RPS = 60 * 1020;
const MAX_RETCNT = 2;
class BaseService {
    static request({ method = "get", url, data, retryCnt = 0, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.requestMethod[method](url, data);
                return res;
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log("instance of Error");
                    console.log(error.message);
                    return this.handleError(error, method, url, data, retryCnt);
                }
                else {
                    console.log("not instance of Error");
                    console.log(error);
                    return this.handleError(error, method, url, data, retryCnt);
                }
            }
        });
    }
    static handleError(error, method, url, data, retryCnt) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error instanceof Error) {
                const errMsg = error.message;
                if (errMsg === "Request Limit" && MAX_RETCNT > retryCnt) {
                    console.log(`came to Request Limit with MAX_RETCNT=${MAX_RETCNT}`);
                    yield new Promise((res) => setTimeout(res, RPS));
                    const res = yield this.request({
                        method,
                        url,
                        data,
                        retryCnt: retryCnt + 1,
                    });
                    return res;
                }
                else if (errMsg === "Request Limit" && MAX_RETCNT <= retryCnt) {
                    console.log(`came to Request Limit with MAX_RETCNT=${MAX_RETCNT} exceeded`);
                    throw new Error("Rate Limit Exceeded");
                }
            }
            return error;
        });
    }
}
BaseService.AUTH = {
    accessToken: "",
    refreshToken: "",
    accessTokenExpireDate: 0,
};
BaseService.requestMethod = {
    get: AxiosInstance_1.default.get,
    post: AxiosInstance_1.default.post,
};
exports.default = BaseService;

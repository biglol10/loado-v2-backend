import axiosInstance from "./AxiosInstance";

const RPS = 60 * 1020;
const MAX_RETCNT = 2;

class BaseService {
  static AUTH: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpireDate: string | Date | number;
  } = {
    accessToken: "",
    refreshToken: "",
    accessTokenExpireDate: 0,
  };

  static requestMethod = {
    get: axiosInstance.get,
    post: axiosInstance.post,
  };

  static async request({
    method = "get",
    url,
    data,
    retryCnt = 0,
  }: {
    method: "get" | "post";
    url: string;
    data: any;
    retryCnt?: number;
  }) {
    try {
      const res = await this.requestMethod[method](url, data);
      return res;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("instance of Error");
        console.log(error.message);
        return this.handleError(error, method, url, data, retryCnt);
      } else {
        console.log("not instance of Error");
        console.log(error);
        return this.handleError(error, method, url, data, retryCnt);
      }
    }
  }

  static async handleError(
    error: unknown,
    method: "get" | "post",
    url: string,
    data: any,
    retryCnt: number
  ): Promise<any> {
    if (error instanceof Error) {
      const errMsg = error.message;

      if (errMsg === "Request Limit" && MAX_RETCNT > retryCnt) {
        console.log(`came to Request Limit with MAX_RETCNT=${MAX_RETCNT}`);
        await new Promise((res) => setTimeout(res, RPS));
        const res = await this.request({
          method,
          url,
          data,
          retryCnt: retryCnt + 1,
        });
        return res;
      } else if (errMsg === "Request Limit" && MAX_RETCNT <= retryCnt) {
        console.log(
          `came to Request Limit with MAX_RETCNT=${MAX_RETCNT} exceeded`
        );
        throw new Error("Rate Limit Exceeded");
      }
    }

    return error;
  }
}

export default BaseService;

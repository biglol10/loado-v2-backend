import { createClient } from "redis";

const redisInstance =
  process.env.npm_lifecycle_event === "dev"
    ? createClient()
    : createClient({
        url: process.env.REDIS_ENDPOINT,
      });

redisInstance.on("error", (err) => console.log("Redis Client Error", err));
redisInstance.connect();

export default redisInstance;

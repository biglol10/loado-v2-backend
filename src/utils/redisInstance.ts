import { createClient } from "redis";

const redisClientUrl =
  process.env.NODE_ENV === "dev"
    ? "127.0.0.1:6379"
    : process.env.REDIS_ENDPOINT;

const redisInstance = createClient({
  url: redisClientUrl,
});

redisInstance.on("error", (err) => console.log("Redis Client Error", err));
redisInstance.connect();

export default redisInstance;

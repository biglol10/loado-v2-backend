import { createClient } from "redis";

const redisClientUrl =
  process.env.NODE_ENV === "dev"
    ? "127.0.0.1:6379"
    : process.env.REDISCLOUD_URL;

const redisInstance = createClient({
  url: redisClientUrl,
});

// const redisInstance = createClient();

redisInstance.on("error", (err) => console.log("Redis Client Error", err));
redisInstance.connect();

export default redisInstance;

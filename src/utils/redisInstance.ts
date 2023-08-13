import { createClient } from "redis";

// Heroku data for redis 일 경우 process.env.REDIS_URL
// Redis Enterprise Cloud 일 경우 process.env.REDISCLOUD_URL (밑에 Security에 Username, pw 확인 가능)

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

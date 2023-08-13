import { createClient } from "redis";

const redisInstance =
  process.env.npm_lifecycle_event === "dev"
    ? createClient()
    : createClient({
        password: process.env.REDIS_PW,
        socket: {
          host: process.env.REDIS_ENDPOINT,
        },
      });

redisInstance.on("error", (err) => console.log("Redis Client Error", err));
redisInstance.connect();

export default redisInstance;

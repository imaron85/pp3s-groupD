import * as redis from "redis";
import ConnectRedis from "connect-redis";
import { Redis } from "ioredis";

// export const redisClient = redis.createClient({
//   url: process.env.REDIS_URL,
// });
const redisClient = new Redis(process.env.REDIS_URL);
redisClient.on("connect", () => {
  console.log("Redis connected");
});
redisClient.on("error", (err) => {
  console.error("Redis error", err);
});
redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting");
});
//redisClient.connect().catch((err) => console.error(err));

export const redisStore = new ConnectRedis({
  client: redisClient,
  prefix: "pp3s-session:",
  ttl: 360000,
});

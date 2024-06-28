import * as redis from "redis";
import ConnectRedis from "connect-redis";

export const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});
redisClient.connect().catch((err) => console.error(err));

export const redisStore = new ConnectRedis({
  client: redisClient,
  prefix: "pp3s-session:",
  ttl: 360000,
});

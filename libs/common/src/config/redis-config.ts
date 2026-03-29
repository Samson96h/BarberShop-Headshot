import { registerAs } from "@nestjs/config";

import { IRedisConfig } from "../models";


export const redisConfig = registerAs("REDIS_CONFIG", (): IRedisConfig => {
  return {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD as string,
    db: Number(process.env.REDIS_DB),
  };
});
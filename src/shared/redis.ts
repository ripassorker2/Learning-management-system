import { StatusCodes } from 'http-status-codes';
import { Redis } from 'ioredis';
import config from '../config';
import ApiError from '../errors/ApiError';

const redisClient = () => {
   if (config.redis_url) {
      console.log('Redis is connected.');
      return config.redis_url;
   }
   throw new ApiError(StatusCodes.BAD_REQUEST, 'Redis connet to faild.');
};
export const redis = new Redis(redisClient());

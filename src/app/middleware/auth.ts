import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import { redis } from '../../shared/redis';

export const auth =
   (...userRoles: string[]) =>
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         //
         const token = req.cookies.accessToken;

         if (!token) {
            throw new ApiError(
               StatusCodes.UNAUTHORIZED,
               'You are not authorized'
            );
         }

         let verifiedUser = null;

         verifiedUser = jwtHelpers.verifyToken(
            token,
            config.jwt.secret_token as Secret
         );

         if (!verifiedUser) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
         }
         const redisUser = await redis.get(verifiedUser.email);
         const user = await JSON.parse(redisUser as string);

         if (!user) {
            throw new ApiError(
               StatusCodes.UNAUTHORIZED,
               'You haveto login to access this.'
            );
         }

         req.user = user; // role  , userid

         // role diye guard korar jnno
         if (userRoles.length && !userRoles.includes(verifiedUser.role)) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Forbidden access.');
         }
         next();
      } catch (error) {
         next(error);
      }
   };

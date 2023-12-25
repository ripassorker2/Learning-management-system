import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';

export const auth =
   (...userRoles: string[]) =>
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         //
         const token = req.headers.authorization;
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

         req.user = verifiedUser; // role  , userid

         // role diye guard korar jnno
         if (userRoles.length && !userRoles.includes(verifiedUser.role)) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Forbidden access.');
         }
         next();
      } catch (error) {
         next(error);
      }
   };

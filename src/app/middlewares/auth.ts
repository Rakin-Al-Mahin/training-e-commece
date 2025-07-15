/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import { ENUM_USER_ROLE } from '../../enums/user';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';

type IAuthRequest = {
  user?: {
    userId: string;
    role: ENUM_USER_ROLE;
  };
} & Request;

/**
 * Authentication middleware with role-based access control
 * @param requiredRoles Array of roles allowed to access the route
 */
const auth =
  (...requiredRoles: ENUM_USER_ROLE[]) =>
  async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      );
      (req as any).user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;

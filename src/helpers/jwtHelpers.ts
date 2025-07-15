// import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

// type ITokenPayload = Record<string, unknown> | string | Buffer;

// const createToken = (
//   payload: ITokenPayload,
//   secret: Secret,
//   expireTime: string
// ): string => {
//   const options: SignOptions = {
//     expiresIn: expireTime,
//   };
//   return jwt.sign(payload, secret, options);
// };

// const createResetToken = (
//   payload: ITokenPayload,
//   secret: Secret,
//   expireTime: string
// ): string => {
//   const options: SignOptions = {
//     algorithm: 'HS256',
//     expiresIn: expireTime,
//   };
//   return jwt.sign(payload, secret, options);
// };

// const verifyToken = (token: string, secret: Secret): JwtPayload => {
//   return jwt.verify(token, secret) as JwtPayload;
// };

// export const jwtHelpers = {
//   createToken,
//   verifyToken,
//   createResetToken,
// };

import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

type ITokenPayload = Record<string, unknown> | string | Buffer;

const createToken = (
  payload: ITokenPayload,
  secret: Secret,
  expireTime: string
): string => {
  const options: SignOptions = {
    expiresIn: expireTime,
  };
  return jwt.sign(payload, secret, options);
};

const createResetToken = (
  payload: ITokenPayload,
  secret: Secret,
  expireTime: string
): string => {
  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: expireTime,
  };
  return jwt.sign(payload, secret, options);
};

const verifyToken = <T extends JwtPayload>(
  token: string,
  secret: Secret
): T => {
  return jwt.verify(token, secret) as T;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
  createResetToken,
};

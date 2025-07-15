/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
declare module 'express' {
  interface Request {
    user?: any;
  }
}

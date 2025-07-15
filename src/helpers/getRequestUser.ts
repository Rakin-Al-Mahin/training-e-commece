/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENUM_USER_ROLE } from '../enums/user';

// Define the user type that will be attached to the request
export type IRequestUser = {
  userId: string;
  role: ENUM_USER_ROLE;
};

// Helper function to safely access the user property
export const getRequestUser = (req: Request): IRequestUser | undefined => {
  return (req as any).user;
};

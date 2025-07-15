import { Types } from 'mongoose';

export type IReview = {
  user: Types.ObjectId;
  product: Types.ObjectId;
  comment: string;
};

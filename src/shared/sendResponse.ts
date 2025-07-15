// src/shared/sendResponse.ts
import { Response } from 'express';

type IMeta = {
  page?: number;
  limit?: number;
  total?: number;
  token?: string; // Add token as optional property
};

type IApiReponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: IMeta; // Updated to use IMeta type
  data?: T | null;
};

const sendResponse = <T>(res: Response, data: IApiReponse<T>): void => {
  const responseData: IApiReponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    meta: data.meta || undefined,
    data: data.data || null,
  };

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;

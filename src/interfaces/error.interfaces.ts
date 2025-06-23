export interface IResponseError {
  success: boolean;
  message: string;
  error: object;
}

export interface CustomError extends Error {
  statusCode?: number;
  errors?: Record<string, string>;
  code?: number;
  keyValue?: Record<string, any>;
  path?: string;
  value?: string;
}

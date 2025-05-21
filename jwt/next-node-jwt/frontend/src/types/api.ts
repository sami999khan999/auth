export interface ApiClientOptionsType
  extends Omit<RequestInit, "body" | "headers"> {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  headers?: Record<string, string>;
  body?: any;
}

export type ApiErrorType = string | null;

export interface ApiResponseType<T> {
  data: T | null;
  error: ApiErrorType;
  status: number;
}

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: true;
  data: T;
  pagination?: Pagination;
};

export type ApiError = {
  success: false;
  error: string;
  issues?: unknown;
};

export const ok = <T>(data: T, pagination?: Pagination): ApiResponse<T> => {
  if (pagination) {
    return {
      success: true,
      data,
      pagination,
    };
  }

  return {
    success: true,
    data,
  };
};

export const fail = (error: string, issues?: unknown): ApiError => {
  if (typeof issues !== 'undefined') {
    return {
      success: false,
      error,
      issues,
    };
  }

  return {
    success: false,
    error,
  };
};

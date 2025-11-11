export type ApiError = {
  status: number;
  json: () => Promise<{ reason: string }>;
};

export const isApiError = (error: unknown): error is ApiError => (
  typeof error === 'object'
    && error !== null
    && 'status' in error
    && typeof (error as any).status === 'number'
    && 'json' in error
    && typeof (error as any).json === 'function'
);

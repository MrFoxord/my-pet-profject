const DEFAULT_API_BASE_URL = "http://localhost:8081";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return trimTrailingSlash(envUrl ?? DEFAULT_API_BASE_URL);
}

function withQuery(path: string, query?: Record<string, string | undefined>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value) {
      params.set(key, value);
    }
  }

  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export const apiRoutes = {
  health: () => `${getApiBaseUrl()}/health`,
  boards: (userId?: string) => withQuery(`${getApiBaseUrl()}/boards`, { userId }),
  boardById: (boardId: string, userId?: string) =>
    withQuery(`${getApiBaseUrl()}/boards/${boardId}`, { userId }),
  boardColumnsOrder: (boardId: string) =>
    `${getApiBaseUrl()}/boards/${boardId}/columns/order`,
  boardColumnById: (boardId: string, columnId: string) =>
    `${getApiBaseUrl()}/boards/${boardId}/columns/${columnId}`,
};

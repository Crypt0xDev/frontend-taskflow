import { API_URL, REQUEST_TIMEOUT_MS, SESSION_FLAG_COOKIE, SESSION_MAX_AGE_MINUTES, TOKEN_KEY } from '@/config/constants';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `${SESSION_FLAG_COOKIE}=1; path=/; max-age=${SESSION_MAX_AGE_MINUTES * 60}; samesite=lax`;
  } catch {}
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${SESSION_FLAG_COOKIE}=; path=/; max-age=0; samesite=lax`;
  } catch {}
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

type ApiOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  timeoutMs?: number;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { timeoutMs = REQUEST_TIMEOUT_MS, headers, body, ...rest } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const token = getToken();

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...rest,
      signal: controller.signal,
      body: body === undefined ? undefined : JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });

    if (res.status === 401) {
      clearToken();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('taskflow:unauthorized'));
      }
      throw new ApiError('No autenticado.', 401);
    }

    const isJson = res.headers
      .get('content-type')
      ?.includes('application/json');
    const data = isJson ? await res.json() : null;

    if (res.status === 429) {
      throw new ApiError('Demasiadas solicitudes. Espera unos segundos e intenta de nuevo.', 429);
    }

    if (!res.ok) {
      throw new ApiError(
        data?.message ?? 'Ocurrió un error en el servidor.',
        res.status,
        data?.errors
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(
        'La solicitud tardó demasiado. Intenta de nuevo.',
        408
      );
    }
    throw new ApiError('No se pudo conectar con el servidor.', 0);
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiFetchList<T>(path: string, options: ApiOptions = {}): Promise<T[]> {
  const data = await apiFetch<T[] | { data: T[] }>(path, options);
  return Array.isArray(data) ? data : data.data;
}

type PaginatedResponse<T> = {
  data: T[];
  meta?: { current_page: number; last_page: number };
};

const PAGE_CONCURRENCY = 4;

export async function apiFetchAllPages<T>(path: string, options: ApiOptions = {}): Promise<T[]> {
  const sep = path.includes('?') ? '&' : '?';
  const first = await apiFetch<T[] | PaginatedResponse<T>>(`${path}${sep}per_page=100`, options);

  if (Array.isArray(first)) return first;

  const lastPage = first.meta?.last_page ?? 1;
  const pages: T[][] = [first.data];

  for (let start = 2; start <= lastPage; start += PAGE_CONCURRENCY) {
    const batch = Array.from({ length: Math.min(PAGE_CONCURRENCY, lastPage - start + 1) }, (_, i) =>
      apiFetch<PaginatedResponse<T>>(`${path}${sep}per_page=100&page=${start + i}`, options),
    );
    for (const page of await Promise.all(batch)) pages.push(page.data);
  }

  return pages.flat();
}

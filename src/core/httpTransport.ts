const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

type Method = typeof METHOD[keyof typeof METHOD];

type Options = {
    method?: Method;
    headers?: Record<string, string>;
    data?: unknown;
    timeout?: number;
    tries?: number;
};

type OptionsWithoutMethod = Omit<Options, 'method'>;

function queryStringify(data: Record<string, string>) {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  // Здесь достаточно и [object Object] для объекта
  const keys = Object.keys(data);
  return keys.reduce(
    (result, key, index) => `${result}${encodeURIComponent(key)}=${encodeURIComponent(data[key])}${index < keys.length - 1 ? '&' : ''}`,
    '?',
  );
}

export default class HTTPTransport {
  private apiUrl: string = '';

  constructor(apiPath: string) {
    this.apiUrl = `https://ya-praktikum.tech/api/v2/${apiPath}`;
  }

  get<TResponse>(
    url: string,
    options: OptionsWithoutMethod = {},
  ): Promise<TResponse> {
    return this.request<TResponse>(`${this.apiUrl}${url}`, {
      ...options,
      method: METHOD.GET,
    });
  }

  post<TResponse>(
    url: string,
    options: OptionsWithoutMethod = {},
  ): Promise<TResponse> {
    return this.request<TResponse>(`${this.apiUrl}${url}`, {
      ...options,
      method: METHOD.POST,
    });
  }

  put<TResponse>(
    url: string,
    options: OptionsWithoutMethod = {},
  ): Promise<TResponse> {
    return this.request<TResponse>(`${this.apiUrl}${url}`, {
      ...options,
      method: METHOD.PUT,
    });
  }

  delete<TResponse>(
    url: string,
    options: OptionsWithoutMethod = {},
  ): Promise<TResponse> {
    return this.request<TResponse>(`${this.apiUrl}${url}`, {
      ...options,
      method: METHOD.DELETE,
    });
  }

  async request<TResponse>(
    url: string,
    options: Options = {},
    timeout: number = 5000,
  ): Promise<TResponse> {
    const { headers = {}, method, data } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        // Создаём Response с ошибкой
        const errorResponse = new Response(null, {
          status: 0,
          statusText: 'No method',
        });
        reject(errorResponse);
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHOD.GET;

      xhr.open(
        method,
        isGet && !!data ? `${url}${queryStringify(data as Record<string, string>)}` : url,
      );
      xhr.withCredentials = true;
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      // Устанавливаем ожидаемый тип ответа
      xhr.responseType = 'json';

      xhr.onload = function load() {
      // Проверяем статус
        const { status } = xhr;
        if (status >= 200 && status < 300) {
          let responseData: TResponse | null = null;
          if (xhr.response) {
            responseData = xhr.response;
          } else {
            try {
              responseData = JSON.parse(xhr.responseText);
            } catch (e) {
              responseData = null;
            }
          }
          resolve(responseData as TResponse);
        } else {
        // Формируем Response с реальным статусом и телом
          const errorBody = xhr.response || xhr.responseText || '';
          const errorResponse = new Response(JSON.stringify(errorBody), {
            status,
            statusText: xhr.statusText,
            headers: {
              'Content-Type': 'application/json',
            },
          });
          reject(errorResponse);
        }
      };

      xhr.onabort = () => {
        const errorResponse = new Response(null, {
          status: 0,
          statusText: 'Request aborted',
        });
        reject(errorResponse);
      };

      xhr.onerror = () => {
        const errorResponse = new Response(null, {
          status: 0,
          statusText: 'Network error',
        });
        reject(errorResponse);
      };

      xhr.timeout = timeout;
      xhr.ontimeout = () => {
        const errorResponse = new Response(null, {
          status: 0,
          statusText: 'Request timeout',
        });
        reject(errorResponse);
      };

      if (isGet || !data) {
        xhr.send();
      } else {
        let body: XMLHttpRequestBodyInit | null = null;

        if (data instanceof FormData) {
          body = data;
        } else if (typeof data === 'string') {
          body = data;
        } else {
          body = JSON.stringify(data);
          xhr.setRequestHeader('Content-Type', 'application/json');
        }

        xhr.send(body);
      }
    });
  }
}

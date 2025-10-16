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
    headers?: any;
    data?: any;
    timeout?: number;
    tries?: number;
};

// Тип Omit принимает два аргумента: первый — тип, второй — строка
// и удаляет из первого типа ключ, переданный вторым аргументом
type OptionsWithoutMethod = Omit<Options, 'method'>;
// Этот тип эквивалентен следующему:
// type OptionsWithoutMethod = { data?: any };

function queryStringify(data: Record<string, string>) {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  // Здесь достаточно и [object Object] для объекта
  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`, '?');
}

function fetchWithRetry(url: string, options: Options = {}): Promise<Response> {
  const { tries = 1 } = options;

  function onError(err: string) {
    const triesLeft = tries - 1;
    if (!triesLeft) {
      throw err;
    }

    return fetchWithRetry(url, { ...options, tries: triesLeft });
  }

  return fetch(url, options).catch(onError);
}

class HTTPTransport {
  get(url: string, options: OptionsWithoutMethod): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHOD.GET }, options.timeout);
  }

  post(url: string, options: OptionsWithoutMethod): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHOD.POST }, options.timeout);
  }

  put(url: string, options: OptionsWithoutMethod): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHOD.PUT }, options.timeout);
  }

  delete(url: string, options: OptionsWithoutMethod): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHOD.DELETE }, options.timeout);
  }

  request(url: string, options: Options = {}, timeout: number = 5000): Promise<XMLHttpRequest> {
    const { headers = {}, method, data } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error('No method'));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHOD.GET;

      xhr.open(
        method,
        isGet && !!data ? `${url}${queryStringify(data)}` : url,
      );

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = function load() {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.timeout = timeout;
      xhr.ontimeout = reject;

      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    });
  }
}

const httptrans = new HTTPTransport();
const fetchretru = fetchWithRetry('test.com', {});
// Просто чтобы не ругался то что их не вызывают
console.log(httptrans, fetchretru);

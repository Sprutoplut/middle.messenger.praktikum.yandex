import { expect } from 'chai';
import sinon from 'sinon';
import HTTPTransport from './httpTransport';

describe('HTTPTransport', () => {
  let transport: HTTPTransport;
  let xhr: sinon.FakeXMLHttpRequest; // Тип для фейкового XHR

  let fakeXHR: sinon.SinonFakeXMLHttpRequest; // Хранит заглушку сервера


  beforeEach(() => {
    transport = new HTTPTransport('/test-api');

    // Создаём фейковый XMLHttpRequest
    fakeXHR = sinon.useFakeXMLHttpRequest();

    // Подписываемся на новые запросы
    fakeXHR.xhr.onCreate = (xhr: sinon.FakeXMLHttpRequest) => {
      xhr.respond = (
        status: number,
        headers?: { [key: string]: string },
        body?: string | ArrayBuffer | ArrayBufferView | Blob | Document | FormData | ReadableStream | null,
        delay?: number
      ) => {
        xhr.status = status;
        xhr.responseHeaders = headers || {};
        xhr.response = body || '';
        xhr.readyState = 4;

        if (status >= 200 && status < 300) {
          xhr.onload?.call(xhr);
        } else {
          xhr.onerror?.call(xhr);
          xhr.statusText = xhr.statusText || 'Error';
        }

        // Имитируем асинхронное выполнение
        setTimeout(() => {
          if (xhr.onload) xhr.onload();
        }, delay || 0);
      };

      xhr.setRequestHeader = sinon.fake(); // Заглушаем setRequestHeader
      xhr.send = sinon.fake();     // Заглушаем send

      // Сохраняем текущий запрос для проверок
      xhrStub = xhr;
    };
  });

  afterEach(() => {
    sinon.restore(); // Восстанавливает реальный XMLHttpRequest
  });

  it('Метод get() должен вызывать request() с методом GET', async () => {
    const requestSpy = sinon.spy(transport, 'request');
    const url = '/users';

    const promise = transport.get(url);

    // Используем respond() для имитации ответа
    xhrStub.respond(
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({})
    );

    await promise;

    expect(requestSpy).to.have.been.calledOnce;
    expect(requestSpy.firstCall.args[1].method).to.equal('GET');
    expect(requestSpy.firstCall.args[0]).to.equal(
      'https://ya-praktikum.tech/api/v2/test-api/users'
    );
  });

  it('request() должен отклонять промис при HTTP-ошибке', async () => {
    const url = '/users';

    try {
      await transport.request(url, { method: 'GET' });
      expect.fail('Запрос не должен был успешно завершиться');
    } catch (error) {
      xhrStub.respond(404, {}, 'Not Found');

      expect(error).to.have.property('status', 404);
      expect(error).to.have.property('statusText', 'Not Found');
    }
  });
});

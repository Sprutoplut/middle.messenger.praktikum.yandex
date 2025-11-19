/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import HTTPTransport from './httpTransport';

describe('HTTPTransport', () => {
  let transport: HTTPTransport = new HTTPTransport('test-api');
  let stubRequest = sinon.stub(transport, 'request');

  beforeEach(() => {
    transport = new HTTPTransport('test-api');

    stubRequest = sinon.stub(transport, 'request');
  });

  afterEach(() => {
    sinon.restore(); // Восстанавливает реальный XMLHttpRequest
  });

  it('Метод get() должен вызывать request() с методом GET', async () => {
    const url = '/users';

    const promise = transport.get(url);

    await promise;

    expect(stubRequest.calledOnce).to.be.true;
    // @ts-expect-error Не получается исправить
    expect(stubRequest.firstCall.args[1].method).to.equal('GET');
    expect(stubRequest.firstCall.args[0]).to.equal(
      'https://ya-praktikum.tech/api/v2/test-api/users',
    );
  });

  it('Метод post() должен вызывать request() с методом POST', async () => {
    const url = '/users';

    const promise = transport.post(url);

    await promise;

    expect(stubRequest.calledOnce).to.be.true;
    // @ts-expect-error Не получается исправить
    expect(stubRequest.firstCall.args[1].method).to.equal('POST');
    expect(stubRequest.firstCall.args[0]).to.equal(
      'https://ya-praktikum.tech/api/v2/test-api/users',
    );
  });

  it('Метод put() должен вызывать request() с методом PUT', async () => {
    const url = '/users';

    const promise = transport.put(url);

    await promise;

    expect(stubRequest.calledOnce).to.be.true;
    // @ts-expect-error Не получается исправить
    expect(stubRequest.firstCall.args[1].method).to.equal('PUT');
    expect(stubRequest.firstCall.args[0]).to.equal(
      'https://ya-praktikum.tech/api/v2/test-api/users',
    );
  });

  it('Метод delete() должен вызывать request() с методом DELETE', async () => {
    const url = '/users';

    const promise = transport.delete(url);

    await promise;

    expect(stubRequest.calledOnce).to.be.true;
    // @ts-expect-error Не получается исправить
    expect(stubRequest.firstCall.args[1].method).to.equal('DELETE');
    expect(stubRequest.firstCall.args[0]).to.equal(
      'https://ya-praktikum.tech/api/v2/test-api/users',
    );
  });
});

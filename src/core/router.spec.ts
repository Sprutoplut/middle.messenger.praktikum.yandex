/* eslint-disable @typescript-eslint/no-unused-expressions */
import sinon from 'sinon';
import { expect } from 'chai';
import Router from './router';
import Block from './block';
import Route from './route';

type Props = {
  [key: string]: unknown;
};

describe('Router', () => {
  let router: Router;
  let mockBlock: Block;

  before(() => {
    class MockBlock extends Block {
      constructor(props: Props) {
        super('div', props);
      }

      render() {
        return `<div data-test="mock-block">${this.props.text || 'Default'}</div>`;
      }
    }

    mockBlock = new MockBlock({ text: 'Test Block' });
  });

  beforeEach(() => {
    (Router as any).instance = null;
    router = new Router('#app');
  });

  it('Метод use() должен добавлять маршрут в коллекцию routes', () => {
    router.use('/test', mockBlock);
    expect(router.routes).to.have.lengthOf(1);
    expect(router.routes[0]).to.be.instanceOf(Route);
  });

  it('Метод use() должен возвращать инстанс роутера для цепочки вызовов', () => {
    const result = router.use('/test', mockBlock);
    expect(result).to.equal(router);
  });

  it('Метод start() должен установить обработчик onpopstate', () => {
    const onpopstateSpy = sinon.spy();
    window.onpopstate = onpopstateSpy;

    router.start();
    expect(window.onpopstate).not.to.equal(onpopstateSpy);
    expect(window.onpopstate).to.be.a('function');
  });

  it('Метод start() должен отобразить текущий маршрут', () => {
    router.use(window.location.pathname, mockBlock);
    const renderSpy = sinon.spy(router.routes[0], 'render');

    router.start();

    expect(renderSpy.calledOnce).to.be.true;
  });

  it('Метод back() должен вызвать history.back()', () => {
    const backSpy = sinon.spy(window.history, 'back');
    router.back();
    expect(backSpy.calledOnce).to.be.true;
  });

  it('Метод forward() должен вызвать history.forward()', () => {
    const forwardSpy = sinon.spy(window.history, 'forward');
    router.forward();
    expect(forwardSpy.calledOnce).to.be.true;
  });

  it('Метод getRoute() должен найти маршрут по pathname', () => {
    router.use('/test', mockBlock);

    const foundRoute = router.getRoute('/test');
    expect(foundRoute).to.equal(router.routes.find((route) => route.match('/test')));
  });

  it('Метод getRoute() должен вернуть wildcard-маршрут, если нет точного совпадения', () => {
    // Добавляем маршруты через use()
    router.use('/exact', mockBlock);
    router.use('*', mockBlock);

    const foundRoute = router.getRoute('/unknown');

    // Находим wildcard-маршрут в коллекции
    const wildcardRoute = router.routes.find((route) => route.match('*'));
    expect(foundRoute).to.equal(wildcardRoute);
  });

  it('go должен вызвать render() у найденного маршрута', () => {
    router.use('/test', mockBlock);
    const route = router.getRoute('/test')!;
    const renderSpy = sinon.spy(route, 'render');

    router.go('/test');
    expect(renderSpy.calledOnce).to.be.true;
  });
});

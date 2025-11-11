import { StoreState } from '../api/type';
import EventBus from './eventBus';

export const StoreEvents = {
  Updated: 'Updated',
} as const;
// @ts-expect-error Не получается исправить
export class Store extends EventBus {
  private state: StoreState | null = null;

  #instance: Store | null = null;

  constructor(defaultState: StoreState) {
    super();
    if (this.#instance) {
      throw new Error('Router уже инициализирован. Используйте Router.getInstance()');
    }

    this.set(defaultState);

    this.#instance = this;
  }

  public getState() {
    return this.state;
  }

  public set(nextState: object) {
    const prevState = { ...this.state };
    // @ts-expect-error Не получается исправить
    this.state = { ...this.state, ...nextState };
    // @ts-expect-error Не получается исправить
    this.emit(StoreEvents.Updated, prevState, nextState);
  }
}

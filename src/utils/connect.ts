import { StoreEvents } from '../core/store';
import isEqual from './Equal';

type Props = {
  [key: string]: unknown;
}
// @ts-expect-error Не получается исправить
export default function connect(mapStateToProps) {
  // @ts-expect-error Не получается исправить
  return function (Component) {
    return class extends Component {
      private onChangeStoreCallback: () => void;

      constructor(props: Props) {
        const { store } = window;
        // сохраняем начальное состояние
        let state = mapStateToProps(store.getState());

        super({ ...props, ...state });

        this.onChangeStoreCallback = () => {
          // при обновлении получаем новое состояние
          const newState = mapStateToProps(store.getState());

          // если что-то из используемых данных поменялось, обновляем компонент
          if (!isEqual(state, newState)) {
            this.setProps({ ...newState });
          }

          // не забываем сохранить новое состояние
          state = newState;
        };

        // подписываемся на событие
        // @ts-expect-error Не получается исправить
        store.on(StoreEvents.Updated, this.onChangeStoreCallback);
      }

      componentWillUnmount() {
        super.componentWillUnmount();
        // @ts-expect-error Не получается исправить
        window.store.off(StoreEvents.Updated, this.onChangeStoreCallback);
      }
    };
  };
}

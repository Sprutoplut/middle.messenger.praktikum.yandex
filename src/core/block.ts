import { nanoid } from 'nanoid';
import Handlebars from 'handlebars';
import EventBus from './eventBus';

type Props = {
  [key: string]: unknown;
}
type Children = Record<string, unknown>;

interface Meta {
  tagName: string;
  props: Props;
}

export default abstract class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  #meta: Meta | null = null;

  #element: HTMLElement | null = null;

  #id: string = nanoid(6);

  get id(): string {
    return this.#id;
  }

  // @ts-expect-error Не получается исправить
  #eventBus: EventBus;

  children: Children = {};

  props: Props;

  /** JSDoc
   * @param {string} tagName
   * @param {Object} props
   *
   * @returns {void}
   */
  constructor(tagName: string = 'div', propsWithChildren: Props = {}) {
    this.#eventBus = new EventBus();

    const { props, children } = this.#getChildrenAndProps(propsWithChildren);
    this.children = children;

    this.#meta = {
      tagName,
      props,
    };

    this.props = this.#makePropsProxy(props);

    this.#registerEvents();
    this.#eventBus.emit(Block.EVENTS.INIT);
  }

  #registerEvents(): void {
    this.#eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    this.#eventBus.on(Block.EVENTS.FLOW_CDM, this.#componentDidMount.bind(this));
    this.#eventBus.on(Block.EVENTS.FLOW_CDU, this.#componentDidUpdate.bind(this));
    this.#eventBus.on(Block.EVENTS.FLOW_RENDER, this.#render.bind(this));
  }

  #createResources() {
    if (this.#meta) {
      const { tagName, props } = this.#meta;
      this.#element = this.#createDocumentElement(tagName);

      if (typeof props.className === 'string') {
        const classes = props.className.split(' ');
        if (this.#element !== null) this.#element.classList.add(...classes);
      }

      if (typeof props.attrs === 'object' && props.attrs !== null) {
        Object.entries(props.attrs).forEach(([attrName, attrValue]) => {
          if (this.#element !== null) this.#element.setAttribute(attrName, String(attrValue));
        });
      }
    }
  }

  init() {
    this.#createResources();
    this.#eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  #getChildrenAndProps(propsAndChildren: Props): {children: Children; props: Props} {
    const children: Children = {};
    const props: Props = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((obj) => {
          if (obj instanceof Block) {
            children[key] = value;
          } else {
            props[key] = value;
          }
        });

        return;
      }
      if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props };
  }

  #componentDidMount() {
    this.componentDidMount();
  }

  componentDidMount(oldProps?: Props) {
    if (oldProps) {

    }
  }

  dispatchComponentDidMount() {
    this.#eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  #componentDidUpdate(oldProps: Props, newProps: Props) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this.#render();
  }

  componentDidUpdate(oldProps: Props, newProps: Props) {
    if (oldProps.someValue !== newProps.someValue) {

    }
    return true;
  }

  setProps(nextProps: Props | null): void {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  }

  get element() {
    return this.#element;
  }

  #addEvents() {
    const { events = {} } = this.props;

    if (events && typeof events === 'object' && !Array.isArray(events)) {
      Object.keys(events).forEach((eventName) => {
        if (eventName in events) {
          this.#element?.addEventListener(eventName, events[eventName as keyof typeof events]);
        }
      });
    }
  }

  #removeEvents() {
    const { events = {} } = this.props;
    if (events && typeof events === 'object' && !Array.isArray(events)) {
      Object.keys(events).forEach((eventName) => {
        this.#element?.removeEventListener(eventName, events[eventName as keyof typeof events]);
      });
    }
  }

  #compile() {
  const propsAndStubs = { ...this.props };
  const debugLog: string[] = []; // Для отладки

  // 1. Формируем заглушки с расширенной информацией
  Object.entries(this.children).forEach(([key, child]) => {
    if (Array.isArray(child)) {
      propsAndStubs[key] = child.map((component, index) => {
        debugLog.push(`Создана заглушка: key=${key}, index=${index}, id=${component.#id}`);
        return `<div 
          data-stub-key="${key}"
          data-stub-index="${index}"
          data-id="${component.#id}"
          class="stub"
          data-debug="array"
        ></div>`;
      });
    } else if (child instanceof Block) {
      debugLog.push(`Создана заглушка: key=${key}, id=${child.#id}`);
      propsAndStubs[key] = `<div
        data-stub-key="${key}"
        data-id="${child.#id}"
        class="stub"
        data-debug="single"
      ></div>`;
    }
  });

  // 2. Создаём фрагмент и компилируем шаблон
  const fragment = this.#createDocumentElement('template') as HTMLTemplateElement;
  const template = Handlebars.compile(this.render());
  fragment.innerHTML = template(propsAndStubs);

  // 3. Собираем все заглушки
  const stubs = fragment.content.querySelectorAll('.stub');
  debugLog.push(`Найдено заглушек: ${stubs.length}`);

  // 4. Замена заглушек с детальной проверкой
  stubs.forEach((stub) => {
    const key = stub.getAttribute('data-stub-key');
    const indexStr = stub.getAttribute('data-stub-index');
    const id = stub.getAttribute('data-id');
    const debugType = stub.getAttribute('data-debug');

    debugLog.push(`Обработка заглушки: key=${key}, index=${indexStr}, id=${id}, type=${debugType}`);

    let component: Block | undefined = undefined;

    if (indexStr !== null) {
      // Элемент массива
      const childArray = this.children[key];
      if (Array.isArray(childArray)) {
        const index = parseInt(indexStr, 10);
        if (!isNaN(index) && index >= 0 && index < childArray.length) {
          component = childArray[index];
          debugLog.push(`Найден компонент массива: index=${index}, id=${component.#id}`);
        } else {
          debugLog.push(`Ошибка: некорректный индекс ${indexStr} для ключа ${key}`);
        }
      } else {
        debugLog.push(`Ошибка: ключ ${key} не является массивом`);
      }
    } else {
      // Одиночный компонент
      component = this.children[key] as Block | undefined;
      if (component) {
        debugLog.push(`Найден одиночный компонент: key=${key}, id=${component.#id}`);
      } else {
        debugLog.push(`Ошибка: компонент с ключом ${key} не найден`);
      }
    }

    // Финальная проверка соответствия id
    if (component && component.#id === id) {
      const content = component.getContent();
      stub.replaceWith(content);
      debugLog.push(`Заменено: ${id} → ${content.tagName}`);
    } else {
      console.warn(
        `[Compile Error] Не найден компонент для заглушки. ` +
        `key=${key}, index=${indexStr}, expectedId=${id}, ` +
        `foundComponentId=${component?.#id ?? 'null'}`
      );
      debugLog.push(`ПРОВАЛ: key=${key}, index=${indexStr}, id=${id}`);
    }
  });

  // Вывод лога отладки (можно отключить в продакшене)
  console.debug('[Compile Debug]', debugLog.join('\n'));

  return fragment.content;
}

  #render() {
    this.#removeEvents();
    const block = this.#compile();

    this.#element?.replaceChildren(block);

    this.#addEvents();
  }

  render() {
    return '';
  }

  getContent(): HTMLElement {
    if (!this.#element) {
      throw new Error('Element is not initialized');
    }
    return this.#element;
  }

  #makePropsProxy(props: Props) {
    const emitBind = this.#eventBus.emit.bind(this.#eventBus);

    return new Proxy(props as Props, {
      get(target, prop) {
        if (typeof prop !== 'string') { // Защита от symbol
          return undefined;
        }
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target, prop, value) {
        if (typeof prop !== 'string') { // Защита от symbol
          return false; // или throw new Error()
        }
        const oldTarget = { ...target };
        target[prop] = value;

        // Запускаем обновление компоненты
        // Плохой cloneDeep, в следующей итерации нужно заставлять добавлять cloneDeep им самим
        emitBind(Block.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  #createDocumentElement(tagName: string) {
    // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
    return document.createElement(tagName);
  }

  show() {
    this.getContent().style.display = 'block';
  }

  hide() {
    this.getContent().style.display = 'none';
  }
}

import { nanoid } from 'nanoid';
import Handlebars from 'handlebars';
import EventBus from './eventBus';

type Props = Record<string, any>;
type Children = Record<string, any>;

interface Meta {
  tagName: string;
  props: Props;
}

// Нельзя создавать экземпляр данного класса
export default class Block {
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

  // @ts-expect-error
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

      if (typeof props.attrs === 'object') {
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
    this.#eventBus().emit(Block.EVENTS.FLOW_CDM);
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

    Object.keys(events).forEach((eventName) => {
      this.#element?.addEventListener(eventName, events[eventName]);
    });
  }

  #removeEvents() {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      this.#element?.removeEventListener(eventName, events[eventName]);
    });
  }

  #compile() {
    const propsAndStubs = { ...this.props };

    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        propsAndStubs[key] = child.map(
          (component) => `<div data-id="${component.#id}"></div>`,
        );
      } else {
        propsAndStubs[key] = `<div data-id="${child.#id}"></div>`;
      }
    });

    const fragment = this.#createDocumentElement('template') as HTMLTemplateElement;
    const template = Handlebars.compile(this.render());
    fragment.innerHTML = template(propsAndStubs);

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((component) => {
          const stub = fragment.content.querySelector(
            `[data-id="${component.#id}"]`,
          );

          stub?.replaceWith(component.getContent());
        });
      } else {
        const stub = fragment.content.querySelector(`[data-id="${child.#id}"]`);

        stub?.replaceWith(child.getContent());
      }
    });

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

    return new Proxy(props as any, {
      get(target, prop) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target, prop, value) {
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

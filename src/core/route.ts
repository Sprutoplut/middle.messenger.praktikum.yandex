import Block from './block';
import { RouteInterface } from './router';

type Props = {
  [key: string]: unknown;
  rootQuery: string;
}

class Route implements RouteInterface {
  #pathname: string;

  #blockClass: Block;

  #block: Block | null;

  #props: Props;

  constructor(pathname: string, view: Block, props: Props) {
    this.#pathname = pathname;
    this.#blockClass = view;
    this.#block = null;
    this.#props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this.#pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this.#block) {
      // this._block.hide();
    }
  }

  match(pathname: string) {
    return pathname === this.#pathname;
  }

  #renderDom(query: string, block: Block) {
    const root = document.querySelector(query);
    if (root) {
      root.innerHTML = '';
      root.append(block.getContent());
    }
  }

  render() {
    if (!this.#block) {
      this.#block = this.#blockClass;
    }

    // this._block.show();
    this.#renderDom(this.#props.rootQuery, this.#block);
    this.#block.componentDidMount();
  }
}

export default Route;

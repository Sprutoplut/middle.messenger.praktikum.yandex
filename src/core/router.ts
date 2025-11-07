import Block from "./block";
import Route from "./route";

export interface RouteInterface {
  render: () => void;
  match: (path: string) => boolean;
  leave: () => void;
}

class Router {
    public routes: RouteInterface[] = [];
    history: History = window.history;
    #currentRoute: RouteInterface | null = null;
    #rootQuery: string = "#app";
    #instance: Router | null = null;
    constructor(rootQuery: string) {
        if (this.#instance) {
          return this.#instance;
        }

        this.routes = [];
        this.#rootQuery = rootQuery;
        this.#instance = this;
    }

    use(pathname: string, block: Block) {
        const route = new Route(pathname, block, {rootQuery: this.#rootQuery});
        this.routes.push(route);
        return this;
    }

    start() {
        window.onpopstate = (event: PopStateEvent) => {
          if (event.currentTarget instanceof Window)
            this.#onRoute(event.currentTarget.location.pathname);
        };
        this.#onRoute(window.location.pathname);
    }

    #onRoute(pathname: string) {
        const route = this.getRoute(pathname);

        if (!route) {
          return;
        }

       if (this.#currentRoute && this.#currentRoute !== route) {
            this.#currentRoute.leave();
        }

        this.#currentRoute = route;
        route.render();
    }

    go(pathname: string) {
      this.history.pushState({}, '', pathname);
      this.#onRoute(pathname);
    }

    back() {
      this.history.back();
    }

    forward() {
      this.history.forward();
    }

    getRoute(pathname: string) {
      const route = this.routes.find(route => route.match(pathname));
      if(!route) {
        return this.routes.find(route => route.match('*'))
      }
      return route
    }
}

export default  Router;


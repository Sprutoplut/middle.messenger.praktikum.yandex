import Handlebars from 'handlebars';
import * as Components from './components';
import * as Pages from './pages';
import * as Layouts from './layouts';

import type Block from './core/block';
import Router from './core/router';
import PATH from './helpers/path';
import { Store } from './core/store';
import { checkLoginUser } from './services/auth';

declare global {
  interface Window {
    store: Store;
    router: Router;
  }
}

// Основной интерфейс страницы
interface PageEntry {
  layout: Block;
}

window.store = new Store({
  // @ts-expect-error Не получается исправить
  user: {},
  isError: false,
  textError: '',
  pathAvatar: '',
  Activeindex: -1,
  members: [],
  membersTemp: [],
  messagesBlock: [],
});

const pages: Record<string, PageEntry> = {
  login: {
    layout: new Layouts.LoginLayout({
      body: new Pages.LoginPage({}), nameForm: 'Вход', textLink: 'Нет аккаунта ?', href: PATH.register,
    }),
  },
  register: {
    layout: new Layouts.LoginLayout({
      body: new Pages.RegisterPage({}), nameForm: 'Регистрация', textLink: 'Войти', href: PATH.login,
    }),
  },
  menu: {
    layout: new Layouts.MainLayout({ body: new Pages.MenuPage() }),
  },
  chat: {
    layout: new Layouts.MainLayout({ body: new Pages.ChatPage({}) }),
  },
  error404: {
    layout: new Layouts.ErrorLayout({ body: new Pages.Error404Page({}), textLink: 'Назад к чатам', href: PATH.chat }),
  },
  error500: {
    layout: new Layouts.ErrorLayout({ body: new Pages.Error500Page({}), textLink: 'Назад к чатам', href: PATH.chat }),
  },
  profile: {
    // @ts-expect-error Не получается исправить
    layout: new Layouts.ProfileLayout({}) as Block,
  },
};

Object.entries(Components).forEach(([name, template]) => {
  if (typeof template === 'function') {
    return;
  }
  Handlebars.registerPartial(name, template);
});

checkLoginUser();

window.router = new Router('#app');
window.router.use(PATH.login, pages.login.layout)
  .use(PATH.register, pages.register.layout)
  .use(PATH.profile, pages.profile.layout)
  .use(PATH.chat, pages.chat.layout)
  .use('*', pages.error404.layout)
  .start();

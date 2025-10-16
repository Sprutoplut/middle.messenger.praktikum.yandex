import Handlebars from 'handlebars';
import * as Components from './components';
import * as Pages from './pages';
import * as Layouts from './layouts';
import members from './pages/chat/members';

import renderDOM from './core/renderDom';
import type Block from './core/block';

// Основной интерфейс страницы
interface PageEntry {
  layout: Block;
}

const pages: Record<string, PageEntry> = {
  login: {
    layout: new Layouts.LoginLayout({ body: new Pages.LoginPage({}), nameForm: 'Вход', textLink: 'Нет аккаунта ?' }),
  },
  register: {
    layout: new Layouts.LoginLayout({ body: new Pages.RegisterPage({}), nameForm: 'Регистрация', textLink: 'Войти' }),
  },
  menu: {
    layout: new Layouts.MainLayout({ body: new Pages.MenuPage() }),
  },
  chat: {
    layout: new Layouts.MainLayout({ body: new Pages.ChatPage({ members }) }),
  },
  error404: {
    layout: new Layouts.ErrorLayout({ body: new Pages.Error404Page(), textLink: 'Назад к чатам' }),
  },
  error500: {
    layout: new Layouts.ErrorLayout({ body: new Pages.Error500Page(), textLink: 'Назад к чатам' }),
  },
  profile: {
    layout: new Layouts.ProfileLayout({
      body: new Pages.ProfilePage({
        value: ['pochta@yandex.ru', 'ivanivanov', 'Иван', 'Иванов', 'Иван', '+7 (909) 967 30 30'],
      }),
      change: false,
      name: 'Иван',
    }),
  },
  profileChangeData: {
    layout: new Layouts.ProfileLayout({
      body: new Pages.ProfileChangeDataPage({
        value: ['pochta@yandex.ru', 'ivanivanov', 'Иван', 'Иванов', 'Иван', '+7 (909) 967 30 30'],
      }),
      change: true,
    }),
  },
  profileChangePassword: {
    layout: new Layouts.ProfileLayout({
      body: new Pages.ProfileChangePasswordPage({
        oldPassword: 'dsadasfasdsa',
      }),
      change: true,
    }),
  },
};
Object.entries(Components).forEach(([name, template]) => {
  if (typeof template === 'function') {
    return;
  }
  Handlebars.registerPartial(name, template);
});

function navigation(page: string) {
  const pageEntry = pages[page];
  const container = document.getElementById('app');

  if (!container) {
    console.error('Контейнер #app не найден в DOM');
    return;
  }
  renderDOM(pageEntry.layout);
}

document.addEventListener('DOMContentLoaded', () => navigation('menu'));

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  if (target && target.getAttribute('page')) {
    const page = target.getAttribute('page');
    if (page) {
      navigation(page);

      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }
});

renderDOM(new Layouts.LoginLayout({
  body: new Pages.LoginPage({}),
  textLink: 'Нет аккаунта ?',
  nameForm: 'Вход',
}));

/* renderDOM(new Layouts.LoginLayout({
  body: new Pages.RegisterPage({}),
  textLink: "Войти",
  nameForm: "Регистрация",
})); */

/* renderDOM(new Layouts.ProfileLayout({
  body: new Pages.ProfileChangePasswordPage({
    oldPassword: "dsadasdas",
  }),
  change: true,
})); */

/* renderDOM(new Layouts.MainLayout({
  body: new Pages.ChatPage({
    members: members,
  }),
})); */

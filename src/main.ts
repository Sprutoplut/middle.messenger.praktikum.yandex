import Handlebars from "handlebars";
import * as Components from './components';
import * as Pages from './pages';
import * as Layouts from './layouts';
import ImgPeople from '/img/PhotoPeople.png';

const pages = {
    'login': [Pages.LoginPage,Layouts.LoginLayout,{textLink: "Нет аккаунта ?", textError: "Неверный пароль" , isError: "true", id_form: "login",nameForm: "Вход"}],
    'register': [Pages.RegisterPage,Layouts.LoginLayout,{id_form: "register", textLink: "Войти",nameForm: "Регистрация"}],
    'menu': [Pages.MenuPage,Layouts.MainLayout],
    'chat': [Pages.ChatPage,Layouts.MainLayout,{isShowRemove: false, isContextMenu: true, name_up: "Вадим", photo_up: ImgPeople,
        members: [
            {MemberPhoto: ImgPeople, LastMessageWho: "Вы", MemberName: "Андрей", LastMessageDate: "10:49", LastMessage: "Друзья, у меня для вас особенный выпуск новостей! Друзья, у меня для вас особенный выпуск новостей!", CountNoReadMessage: 2},
            {MemberPhoto: ImgPeople, LastMessageWho: "Вы", MemberName: "Андрей", LastMessageDate: "10:49", LastMessage: "Друзья, у меня для вас особенный выпуск новостей! Друзья, у меня для вас особенный выпуск новостей!", CountNoReadMessage: 0},
            {MemberPhoto: ImgPeople, MemberName: "Андрей", LastMessageDate: "10:49", LastMessage: "Друзья, у меня для вас особенный выпуск новостей! Друзья, у меня для вас особенный выпуск новостей!", CountNoReadMessage: 4},
            {MemberPhoto: ImgPeople, MemberName: "Андрей", LastMessageDate: "10:49", LastMessage: "Друзья, у меня для вас особенный выпуск новостей! Друзья, у меня для вас особенный выпуск новостей!", CountNoReadMessage: 0},
            {MemberPhoto: ImgPeople, MemberName: "Андрей", LastMessageDate: "10:49", LastMessage: "Друзья, у меня для вас особенный выпуск новостей! Друзья, у меня для вас особенный выпуск новостей!", CountNoReadMessage: 0},
            {MemberPhoto: ImgPeople, MemberName: "Андрей", LastMessageDate: "10:49", LastMessage: "Друзья, у меня для вас особенный выпуск новостей! Друзья, у меня для вас особенный выпуск новостей!", CountNoReadMessage: 0},
            {MemberPhoto: ImgPeople, MemberName: "Андрей", LastMessageDate: "10:49", LastMessage: "Друзья, у меня для вас особенный выпуск новостей! Друзья, у меня для вас особенный выпуск новостей!", CountNoReadMessage: 0},
            {MemberPhoto: ImgPeople, MemberName: "Андрей", LastMessageDate: "10:49", LastMessage: "Друзья, у меня для вас особенный выпуск новостей! Друзья, у меня для вас особенный выпуск новостей!", CountNoReadMessage: 0},
            {MemberPhoto: ImgPeople, MemberName: "Андрей", LastMessageDate: "10:49", LastMessage: "Друзья, у меня для вас особенный выпуск новостей! Друзья, у меня для вас особенный выпуск новостей!", CountNoReadMessage: 0},
            
        ],
        ChatDate: "19 июня",
        messages: [
            {author: "author", message: "Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.\nХассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.", time: "11:56"},
            {message: "Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.\nХассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.", time: "11:56"},
        ]
    }],
    'error404': [Pages.Error404Page,Layouts.ErrorLayout],
    'error500': [Pages.Error500Page,Layouts.ErrorLayout],
    'profile': [Pages.ProfilePage,Layouts.ProfileLayout, {name: "Иван",isShow: false,isFile: true,isErrorFile: true,isError: false}],
    'profileChangeData': [Pages.ProfileChangeDataPage,Layouts.ProfileLayout,{change: "true"}],
    'profileChangePassword': [Pages.ProfileChangePasswordPage,Layouts.ProfileLayout,{change: "true"}]
};
Object.entries(Components).forEach(
    ([name, template]) => {
        Handlebars.registerPartial(name, template);
    }
);

function navigation(page: string) {
    //@ts-ignore
    const [source, layout, context ]= pages[page];
    const container = document.getElementById('app')!;
    const templatingFunction = Handlebars.compile(source);
    const layoutFunction = Handlebars.compile(layout)
    if (layout == Layouts.LoginLayout) container.innerHTML = layoutFunction({body: templatingFunction(context),textLink: context.textLink,id_form: context.id_form,nameForm: context.nameForm});
    if (layout == Layouts.ErrorLayout || layout == Layouts.MainLayout) container.innerHTML = layoutFunction({body: templatingFunction(context)});
    if (layout == Layouts.ProfileLayout) container.innerHTML = layoutFunction({body: templatingFunction(context), change: context.change, name: context.name, isShow: context.isShow,isFile: context.isFile,isErrorFile: context.isErrorFile,isError: context.isError});
}

document.addEventListener('DOMContentLoaded', () => navigation('menu'));

document.addEventListener('click', e => {
    //@ts-ignore
    const page = e.target.getAttribute('page');
    if (page)
    {
        navigation(page);

        e.preventDefault();
        e.stopImmediatePropagation();
    }
})
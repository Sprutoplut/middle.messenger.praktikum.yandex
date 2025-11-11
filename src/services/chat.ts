import ChatApi from '../api/chat';
import {
  AddUser, ChatDTO, CreateChat, MemberListProps,
  StoreState,
  UserDTO,
} from '../api/type';
import { isApiError } from '../utils/isApiError';
import { search } from './users';

const chatApi = new ChatApi();

export const create = async (model: CreateChat | unknown) => {
  window.store.set({ isLoading: true });
  try {
    const chat = await chatApi.create(model);
    await get();
    window.store.set({ Activeindex: chat.id });
  } catch (responsError) {
    if (isApiError(responsError)) {
      const error = await responsError.json();
      window.store.set({ isError: true, textError: error.reason });
    }
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const get = async (/* model: GetChatsParameter */) => {
  window.store.set({ isLoading: true });

  try {
    const membersState = await chatApi.getChats();
    const members = await mapChatsToMemberListProps(membersState);
    window.store.set({ members });
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'Неизвестная ошибка';

    window.store.set({
      isError: true,
      textError: errorMessage,
    });
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const getUser = async (model: number): Promise<UserDTO[] | null> => {
  window.store.set({ isLoading: true });

  try {
    const users = await chatApi.getUsersChat(model);
    return users;
  } catch (error) {
    // 2. Извлекаем сообщение из ошибки (универсально)
    let errorMessage = 'Неизвестная ошибка';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // 3. Если это HTTP-ошибка с телом JSON
    if (error && typeof error === 'object' && 'response' in error) {
      try {
        const responseData = await (error as any).response.json();
        errorMessage = responseData.reason || responseData.message || errorMessage;
      } catch (jsonError) {
      }
    }

    // 4. Обновляем store
    window.store.set({
      isError: true,
      textError: errorMessage,
    });

    // 5. Возвращаем null или пустой массив
    return null; // или return [];
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const getUnread = async (model: number) => {
  window.store.set({ isLoading: true });
  try {
    const count = await chatApi.getUnreadCount(model);
    return count;
  } catch (responsError) {
    return 0;
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const addUser = async (model: AddUser) => {
  window.store.set({ isLoading: true });
  try {
    await chatApi.adduser(model);
  } catch (responsError) {
    // const error = await responsError.json();
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const deleteUser = async (model: AddUser) => {
  window.store.set({ isLoading: true });
  try {
    await chatApi.deleteuser(model);
  } catch (responsError) {
    if (isApiError(responsError)) {
      const error = await responsError.json();
      window.store.set({ isError: true, textError: error.reason });
    }
  } finally {
    window.store.set({ isLoading: false });
  }
};

async function findUserByIdLogin(
  users: UserDTO[],
  login: string,
): Promise<UserDTO | undefined> {
  return users.find((user) => user.login === login);
}

export const findAndDelete = async (
  login: { login: string } | unknown,
  index: number | unknown,
): Promise<void> => {
  try {
    // Проверяем, что login имеет корректный тип
    if (typeof login !== 'object' || login === null || !('login' in login)) {
      return;
    }

    const loginStr = (login as { login: string }).login;

    // Получаем список пользователей (предполагаем, что search возвращает UserDTO[])
    const users = await search(login);

    // Ищем пользователя с указанным логином
    const user = await findUserByIdLogin(users as UserDTO[], loginStr);

    if (!user) {
      return;
    }

    // Проверяем index
    if (typeof index !== 'number' || index === -1) {
      return;
    }

    await deleteUser({ users: [user.id], chatId: index });
  } catch (error) {
  }
};

export const findAndAdd = async (
  login: { login: string } | unknown,
  index: number | unknown,
): Promise<void> => {
  try {
    // Проверяем login
    if (typeof login !== 'object' || login === null || !('login' in login)) {
      return;
    }

    const loginStr = (login as { login: string }).login;

    // Получаем всех пользователей
    const users = await search(login);

    // Ищем нужного пользователя
    const user = await findUserByIdLogin(users as UserDTO[], loginStr);

    if (!user) {
      return;
    }

    // Проверяем index
    if (typeof index !== 'number' || index === -1) {
      return;
    }

    // Добавляем пользователя в чат
    await addUser({ users: [user.id], chatId: index });
  } catch (error) {
  }
};

export const token = async (model: number | unknown): Promise<string> => {
  try {
    const token = await chatApi.token(model);
    return token.token;
  } catch (responsError) {
    return 'errorToken';
  }
};

export async function mapChatsToMemberListProps(chats: ChatDTO[]): Promise<MemberListProps[]> {
  const promises = chats.map((chat) => mapChatToMemberListProps(chat));
  return Promise.all(promises);
}

function formatDateRelative(isoString: string): string {
  const inputDate = new Date(isoString);
  const now = new Date();

  // Вспомогательные функции
  const isToday = (date: Date, now: Date): boolean => (
    date.getFullYear() === now.getFullYear()
      && date.getMonth() === now.getMonth()
      && date.getDate() === now.getDate()
  );

  const isThisWeek = (date: Date, now: Date): boolean => {
    const currentDayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDayOfWeek);
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - currentDayOfWeek));

    return date >= startOfWeek && date <= endOfWeek;
  };

  const isThisYear = (date: Date, now: Date): boolean => date.getFullYear() === now.getFullYear();

  // Названия дней недели (сокращённые)
  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  // Форматирование
  if (isToday(inputDate, now)) {
    // Только часы и минуты
    return inputDate.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } if (isThisWeek(inputDate, now)) {
    // Сокращённый день недели
    return weekDays[inputDate.getDay()];
  } if (isThisYear(inputDate, now)) {
    // День и месяц
    return inputDate.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
    });
  }
  // День, месяц и год
  return inputDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
/**
 * Преобразует один ChatDTO в MemberListProps (внутренняя функция)
 */
export async function mapChatToMemberListProps(chat: ChatDTO): Promise<MemberListProps> {
  const props: MemberListProps = {};

  props.id = chat.id;

  // MemberName — берём из title чата
  if (chat.title) {
    props.MemberName = chat.title;
  }

  // MemberPhoto — аватар чата (может быть null)
  if (chat.avatar === null) {
    try {
      const users = await getUser(chat.id); // Ждём результат!

      if (Array.isArray(users) && users.length > 0) {
        const otherUser = users.find(
          (user) => user.login !== ((window.store.getState() as StoreState).user as UserDTO).login,
        );
        if (otherUser !== undefined) {
          if (otherUser?.avatar !== null) {
            props.MemberPhoto = `https://ya-praktikum.tech/api/v2/resources${otherUser.avatar}`;
          } else {
            props.MemberPhoto = '/img/Avatar.png';
          }
        } else {
          props.MemberPhoto = '/img/Avatar.png';
        }
      } else {
        props.MemberPhoto = '/img/Avatar.png';
      }
    } catch (error) {
      props.MemberPhoto = '/img/Avatar.png';
    }
  } else {
    props.MemberPhoto = `https://ya-praktikum.tech/api/v2/resources${chat.avatar}`;
  }

  // CountNoReadMessage — количество непрочитанных сообщений
  if (typeof chat.unread_count === 'number' && chat.unread_count > 0) {
    props.CountNoReadMessage = chat.unread_count;
  }

  // LastMessage, LastMessageDate, LastMessageWho — из last_message
  if (chat.last_message) {
    const lastMsg = chat.last_message;

    // LastMessage — текст сообщения
    if (lastMsg.content) {
      props.LastMessage = lastMsg.content;
    }

    // LastMessageDate — дата сообщения
    if (lastMsg.time) {
      props.LastMessageDate = formatDateRelative(lastMsg.time);
    }

    // LastMessageWho — имя отправителя
    if (lastMsg.user.login !== ((window.store.getState() as StoreState).user as UserDTO).login) {
      props.LastMessageWho = lastMsg.user.display_name;
    } else {
      props.LastMessageWho = 'Вы';
    }
  }

  return props;
}

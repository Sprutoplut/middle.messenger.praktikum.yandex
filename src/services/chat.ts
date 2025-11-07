
import ChatApi from "../api/chat";
import { ChatDTO, CreateChat, GetChatsParameter, MemberListProps } from "../api/type";

const chatApi = new ChatApi();

export const create = async (model: CreateChat) => {
  window.store.set({ isLoading: true });
  try {
    const chat = await chatApi.create(model);
    await get();
    window.store.set({ Activeindex: chat.id });
  } catch (responsError) {
    const error = await responsError.json();
    window.store.set({ isError: true, textError: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const get = async (/*model: GetChatsParameter*/) => {
  window.store.set({ isLoading: true });
  try {
    const membersState = await chatApi.getChats();
    const members = mapChatsToMemberListProps(membersState);
    window.store.set({ members: members });
  } catch (responsError) {
    const error = await responsError.json();
    window.store.set({ isError: true, textError: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};


function mapChatsToMemberListProps(chats: ChatDTO[]): MemberListProps[] {
  return chats.map(chat => mapChatToMemberListProps(chat));
}

/**
 * Преобразует один ChatDTO в MemberListProps (внутренняя функция)
 */
function mapChatToMemberListProps(chat: ChatDTO): MemberListProps {
  const props: MemberListProps = {};

  props.id = chat.id;

  // MemberName — берём из title чата
  if (chat.title) {
    props.MemberName = chat.title;
  }

  // MemberPhoto — аватар чата (может быть null)
  if (chat.avatar) {
    props.MemberPhoto = chat.avatar;
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
      props.LastMessageDate = lastMsg.time;
    }

    // LastMessageWho — имя отправителя
    if (lastMsg.user.login !== window.store.getState().user.login) {
      props.LastMessageWho = lastMsg.user.display_name;
    }
  }

  return props;
}



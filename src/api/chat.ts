import HTTPTransport from '../core/httpTransport';
import {
  AddUser,
  ChatDTO,
  CreateChat,
  CreateChatResponse,
  TokenChat,
  UnreadCount,
  UserDTO,
} from './type';

const chatApi = new HTTPTransport('chats');

export default class ChatApi {
  async create(data: CreateChat | unknown): Promise<CreateChatResponse> {
    return chatApi.post<CreateChatResponse>('', { data });
  }

  async adduser(data: AddUser) {
    return chatApi.put('/users', { data });
  }

  async deleteuser(data: AddUser) {
    return chatApi.delete('/users', { data });
  }

  async getChats(/* data: GetChatsParameter */): Promise<ChatDTO[]> {
    return chatApi.get<ChatDTO[]>('');
  }

  async token(data: number | unknown): Promise<TokenChat> {
    return chatApi.post<TokenChat>(`/token/${data}`);
  }

  async getUsersChat(data: number): Promise<UserDTO[]> {
    return chatApi.get<UserDTO[]>(`/${data}/users`);
  }

  async getUnreadCount(data: number): Promise<UnreadCount> {
    return chatApi.get<UnreadCount>(`/new/${data}`);
  }
}

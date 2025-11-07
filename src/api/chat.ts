import { HTTPTransport } from "../core/httpTransport";
import {
  ChatDTO,
  CreateChat,
  CreateChatResponse,
  GetChatsParameter,
} from "./type";

const chatApi = new HTTPTransport("chats");

export default class ChatApi {
  async create(data: CreateChat): Promise<CreateChatResponse> {
    return chatApi.post<CreateChatResponse>("", { data });
  }
  async getChats(/*data: GetChatsParameter*/): Promise<ChatDTO[]> {
    return chatApi.get<ChatDTO[]>("");
    //return chatApi.get<ChatDTO[]>("" + '?offset=' + data.offset + '&limit=' + data.limit + '&title=' + data.title);
  }
}

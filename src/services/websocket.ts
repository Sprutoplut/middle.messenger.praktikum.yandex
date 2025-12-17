import {
  Message, messagesBlock, StoreState, UserDTO, WSMessageResponse,
} from '../api/type';
import { token } from './chat';

export default class ChatWebSocket {
  private socket: WebSocket | null = null;

  private tempMessages: Message[] = [];

  private userId: number = 0;

  private chatId: number | unknown = 1;

  private token: string = '';

  private pingInterval: number | null = null;

  private PING_INTERVAL = 30000;

  private messageResolve: ((value: void) => void) | null = null;

  private pendingRequests = 0; // Счётчик ожидающих запросов

  /**
* Инициирует подключение к WebSocket
*/
  public async connect(chatId: number | unknown, userId: number): Promise<void> {
  // Защита от параллельных вызовов
    if (this.socket && this.socket.readyState !== WebSocket.CLOSING) {
      await this.disconnect();
    }

    try {
      this.userId = userId;
      this.chatId = chatId;
      this.token = await token(this.chatId);

      const url = `wss://ya-praktikum.tech/ws/chats/${this.userId}/${this.chatId}/${this.token}`;
      this.socket = new WebSocket(url);

      this.setupEventListeners();
      this.startPing();
    } catch (error) {
      console.log('Соединение не установлено');
      throw error; // Чтобы catch в connectWebSocket сработал
    }
  }

  private startPing(): void {
    if (this.pingInterval) return;

    this.pingInterval = window.setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, this.PING_INTERVAL);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
* Настраивает обработчики событий WebSocket
*/
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onclose = this.onClose.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onerror = this.onError.bind(this);
  }

  /**
* Обработчик успешного подключения
*/
  private onOpen(): void {
    this.loadHistory().catch(() => {
      console.log('Ошибка загрузки истории');
    });
  }

  /**
* Обработчик закрытия соединения
*/
  private onClose(): void {
    console.log('Соединение закрыто');
  }

  /**
* Обработчик получения сообщения
*/
  private onMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'ping') return;

      if (data.type === 'user connected') {
        this.markAllMessagesAsRead();
        return;
      }

      if (data.type === 'message' && data.content != null) {
        const newMessage = {
          content: data.content,
          userId: data.user_id || null,
          timestamp: data.timestamp || Date.now(),
          is_read: data.is_read,
        };

        this.addMessageToBlocks(newMessage as Message);
        return;
      }
      if (Array.isArray(data)) {
        this.processOldMessages(data as WSMessageResponse[]);
        this.pendingRequests -= 1; // Уменьшаем счётчик

        // Если все запросы обработаны — завершаем загрузку
        if (this.pendingRequests === 0 && this.messageResolve) {
          this.messageResolve();
          this.messageResolve = null;
        }
      }
    } catch (error) {
    }
  }

  private async waitForAllMessages(): Promise<void> {
    return new Promise((resolve) => {
      this.messageResolve = resolve;
      // Если запросов нет — сразу разрешаем
      if (this.pendingRequests === 0) {
        resolve();
      }
    });
  }

  /**
* Обработчик ошибок
*/
  private onError(): void {
    console.log('Произошла ошибка');
  }

  private processOldMessages(messages: WSMessageResponse[]): void {
    const convertedMessages = messages.map((msg) => ({
      content: msg.content,
      userId: msg.user_id,
      timestamp: Date.parse(msg.time),
      id: msg.id,
      is_read: msg.is_read,
    }));

    // Добавляем в буфер, а не в store
    this.tempMessages.push(...convertedMessages);
  }

  private addMessageToBlocks(message: Message): void {
    const currentBlocks = (window.store.getState() as StoreState).messagesBlock || [];
    const updatedBlocks = addMessageToGroupedBlocks(currentBlocks, message);
    const sortedBlocks = this.sortBlocksByDateDesc(updatedBlocks);
    window.store.set({ messagesBlock: sortedBlocks });
  }

  private sendGetOldMessages(offset: number): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }
    this.pendingRequests += 1;
    const request = {
      type: 'get old',
      content: offset.toString(),
    };

    this.socket.send(JSON.stringify(request));
  }

  /**
* Отправка сообщения через WebSocket
* @param message Объект сообщения
*/
  public sendMessage(message: { content: string | unknown; type: string }): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
    }
  }

  /**
* Закрытие соединения
*/
  public disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve();
        return;
      }

      // 1. Отвязать все обработчики
      this.socket.onopen = null;
      this.socket.onclose = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;

      // 2. Остановить ping
      this.stopPing();

      // 3. Принудительно обнулить счётчики
      this.pendingRequests = 0;
      if (this.messageResolve) {
        this.messageResolve(); // Разрешить текущий Promise
        this.messageResolve = null;
      }

      // 4. Очистить буфер
      this.tempMessages = [];

      // 5. Закрыть сокет
      this.socket.close();

      // 6. Установить null и вызвать resolve
      const onClose = () => {
        this.socket = null;
        resolve();
      };

      // Если сокет уже закрыт — сразу resolve
      if (this.socket.readyState === WebSocket.CLOSED) {
        onClose();
      } else {
      // Иначе ждём события close
        this.socket.onclose = onClose;
      }
    });
  }

  public async loadHistory(): Promise<void> {
    try {
      window.store.set({ messagesBlock: [] });
      this.tempMessages = [];
      this.abortFetch = false;
      await this.fetchMessagesRecursively(0);
      this.commitBufferedMessages();
    } catch (error) {
    }
  }

  private abortFetch: boolean = false;

  private async fetchMessagesRecursively(currentOffset: number, depth = 0): Promise<void> {
    if (this.abortFetch || depth > 10) {
      return;
    }

    this.sendGetOldMessages(currentOffset);
    await this.waitForAllMessages();

    const newMessages = this.tempMessages.filter((msg) => msg.id > currentOffset);

    if (newMessages.length === 0 || this.abortFetch) {
      return;
    }

    const nextOffset = Math.max(...newMessages.map((msg) => msg.id));
    await this.fetchMessagesRecursively(nextOffset, depth + 1);
  }

  // Метод для прерывания загрузки
  public abortHistoryLoad(): void {
    this.abortFetch = true;
    this.pendingRequests = 0;
    if (this.messageResolve) {
      this.messageResolve();
      this.messageResolve = null;
    }
  }

  private commitBufferedMessages(): void {
  // Сортируем все сообщения по времени (новые → старые)
    const sortedMessages = [...this.tempMessages].sort(
      (a, b) => b.timestamp - a.timestamp,
    );

    // Преобразуем в блоки
    const blocks: messagesBlock[] = sortedMessages.reduce(
      (acc, msg) => addMessageToGroupedBlocks(acc, msg, true),
      [] as messagesBlock[],
    );

    // Обратное переворачивание сообщений в блоках (если нужно)
    const finalBlocks = blocks.map((block) => ({
      ...block,
      messages: [...block.messages].reverse(),
    }));

    window.store.set({ messagesBlock: finalBlocks });
    this.tempMessages = []; // Очищаем буфер
  }

  private markAllMessagesAsRead(): void {
    const blocks = (window.store.getState() as StoreState).messagesBlock || [];

    const updatedBlocks = blocks.map((block) => ({
      ...block,
      messages: block.messages.map((msg) => {
      // Если сообщение не от нас → считаем прочитанным
        if (msg.author === '') {
          return {
            ...msg,
            read: 'Read',
          };
        }
        return msg; // Наши сообщения не трогаем
      }),
    }));
    window.store.set({ messagesBlock: updatedBlocks });
  }

  private sortBlocksByDateDesc(blocks: messagesBlock[]): messagesBlock[] {
    return [...blocks]
      .filter((block) => block.dateBlock !== undefined)
      .sort((a, b) => {
        const aDate = new Date(a.dateBlock!);
        const bDate = new Date(b.dateBlock!);
        return bDate.getTime() - aDate.getTime(); // a - b = возрастание (старые → новые)
      });
  }

  /**
* Проверка состояния соединения
* @returns true, если соединение активно
*/
  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

function addMessageToGroupedBlocks(
  blocks: messagesBlock[],
  message: Message,
  history: boolean = false,
): messagesBlock[] {
  const messageDate = formatDateForBlock(message.timestamp);

  // Ищем блок с нужной датой
  const targetBlock = blocks.find((block) => block.dateBlock === messageDate);

  if (targetBlock) {
    // Добавляем в существующий блок

    targetBlock.messages.push({
      message: message.content,
      time: new Date(message.timestamp).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      author: message.userId === ((window.store.getState() as StoreState).user as UserDTO).id ? '' : 'author',
      read: message.is_read ? 'Read' : '', // или другое значение по логике
      id: message.id,
    });

    targetBlock.messages.sort((a, b) => {
      const aTimestamp = (a as { timestamp?: string }).timestamp;
      const bTimestamp = (b as { timestamp?: string }).timestamp;

      const aTime = aTimestamp ? Date.parse(aTimestamp) : 0;
      const bTime = bTimestamp ? Date.parse(bTimestamp) : 0;

      return aTime - bTime;
    });
  } else if (history === true) {
    // Создаём новый блок
    blocks.push({
      dateBlock: messageDate,
      messages: [
        {
          message: message.content,
          time: new Date(message.timestamp).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          author: message.userId === ((window.store.getState() as StoreState).user as UserDTO).id ? '' : 'author',
          read: message.is_read ? 'Read' : '',
          id: message.id,
        },
      ],
    });
  } else {
    // Создаём новый блок
    blocks.unshift({
      dateBlock: messageDate,
      messages: [
        {
          message: message.content,
          time: new Date(message.timestamp).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          author: message.userId === ((window.store.getState() as StoreState).user as UserDTO).id ? '' : 'author',
          read: message.is_read ? 'Read' : '',
          id: message.id,
        },
      ],
    });
  }

  return blocks;
}

function formatDateForBlock(timestamp: number): string {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0–11 → 1–12
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

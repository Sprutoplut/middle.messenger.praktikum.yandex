export type APIError = {
    reason: string;
};

export type SignUpResponse = {
    id: number
}

export type UserDTO = {
    id: number;
    login: string;
    first_name: string;
    second_name: string;
    display_name: string;
    avatar: string;
    phone: string;
    email: string;
};

export type CreateUser = Omit<UserDTO, 'avatar' | 'display_name' | 'id'>  & {
    password: string
}

export type CreateChat = {
    title: string
}

export type LoginRequestData = {
    login: string,
    password: string
}

type LastMessage = {
    user: UserDTO,
    time: string,
    content: string
}

export type ChatDTO = {
    id: number,
    title: string,
    avatar: string | null,
    unread_count: number,
    last_message: LastMessage | null
}

export type Resource = {
    id: number,
    user_id: number,
    path: string,
    filename: string,
    content_type: string,
    content_size: number,
    upload_date: string,
}

export type ChangePassword = {
    oldPassword: string,
    newPassword: string
}

export type CreateChatResponse = {
    id: number,
}

export type GetChatsParameter = {
    offset: number,
    limit: number,
    title: string,
}

export type messages = {
    message?: string;
    time?: string;
    author?: string;
    read?: string;
}

export type messagesBlock = {
    messages: messages[],
    dateBlock?: string,
}

export type MemberListProps = {
    id?: number;
    MemberPhoto?: string;
    LastMessageDate?: string;
    LastMessageWho?: string;
    LastMessage?: string;
    CountNoReadMessage?: number;
    MemberName?: string;
    onClick?: () => void;
}


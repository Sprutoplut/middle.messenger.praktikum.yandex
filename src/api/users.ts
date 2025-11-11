import HTTPTransport from '../core/httpTransport';
import {
  APIError,
  ChangePassword,
  UserDTO,
} from './type';

const authApi = new HTTPTransport('user');

export default class UsersApi {
  async changeData(data: UserDTO): Promise<UserDTO> {
    return authApi.put('/profile', { data });
  }

  async search(data: {login: string} | unknown): Promise<UserDTO[]> {
    return authApi.post('/search', { data });
  }

  async changePassword(data: ChangePassword): Promise<void | APIError> {
    return authApi.put('/password', { data });
  }

  async changeAvatar(data: FormData): Promise<UserDTO> {
    return authApi.put('/profile/avatar', { data });
  }
}

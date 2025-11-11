import { ChangePassword, UserDTO } from '../api/type';
import UsersApi from '../api/users';
import PATH from '../helpers/path';
import { isApiError } from '../utils/isApiError';

const usersApi = new UsersApi();

export const changeData = async (model: UserDTO) => {
  window.store.set({ isLoading: true });
  try {
    const user = await usersApi.changeData(model);
    window.store.set({ user });
    window.router.go(PATH.chat);
  } catch (responsError) {
    if (isApiError(responsError)) {
      const error = await responsError.json();
      window.store.set({ isError: true, textError: error.reason });
    }
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const search = async (model: {login: string} | unknown) => {
  window.store.set({ isLoading: true });
  try {
    const user = await usersApi.search(model);
    return user;
  } catch (responsError) {
    if (isApiError(responsError)) {
      const error = await responsError.json();
      window.store.set({ isError: true, textError: error.reason });
    }
    return null;
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const changePassword = async (model: ChangePassword) => {
  window.store.set({ isLoading: true });
  try {
    await usersApi.changePassword(model);
    window.store.set({ isError: false });
    window.router.go(PATH.chat);
  } catch (responsError) {
    if (isApiError(responsError)) {
      if (responsError.status === 400) {
        window.store.set({ isError: true, textError: 'Неправильный пароль' });
      } else {
        const error = await responsError.json();
        window.store.set({ isError: true, textError: error.reason });
      }
    }
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const changeAvatar = async (model: FormData) => {
  window.store.set({ isLoading: true });
  try {
    const user = await usersApi.changeAvatar(model);
    window.store.set({ user });
  } catch (responsError) {
    if (isApiError(responsError)) {
      const error = await responsError.json();
      window.store.set({ isError: true, textError: error.reason });
    }
  } finally {
    window.store.set({ isLoading: false });
  }
};

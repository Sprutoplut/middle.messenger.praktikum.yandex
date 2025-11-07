
import AuthApi from "../api/auth";
import { CreateUser, LoginRequestData, UserDTO } from "../api/type";
import { PATH } from "../helpers/path";
import { loadAvatar } from "./resources";
import * as chatServices from "./chat";

const authApi = new AuthApi();

export const login = async (model: LoginRequestData) => {
  window.store.set({ isLoading: true });
  try {
    await authApi.login(model);
    await checkLoginUser(true);
    window.store.set({ isError: false });
    window.router.go(PATH.chat);
  } catch (responsError) {
    if (responsError.status === 401) {
      //window.store.set({ isError: true, textError: "Неверный логин или пароль" });
      const error = await responsError.json();
      window.store.set({ isError: true, textError: error.reason });
    }
    else if (responsError.status === 400) {
      checkLoginUser();
      window.router.go(PATH.chat);
    }
    else
    {
      const error = await responsError.json();
      window.store.set({ isError: true, textError: error.reason });
    }
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const register = async (model: CreateUser) => {
  window.store.set({ isLoading: true });
  try {
    await authApi.create(model);
  } catch (responsError) {
    const error = await responsError.json();
    window.store.set({ isError: true, textError: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const logout = async () => {
  window.store.set({ isLoading: true });
  try {
    await authApi.logout();
    const userNull =
    {
      id: null,
      login: null,
      first_name: null,
      second_name: null,
      display_name: null,
      avatar: null,
      phone: null,
      email: null,
    }
    window.store.set({ user: userNull });
    window.router.go(PATH.login);
  } catch (responsError) {

  } finally {
    window.store.set({ isLoading: false });
  }
};

export const checkLoginUser = async (throwOnError: boolean = false) => {
  window.store.set({ isLoading: true });
  try {
    const user = await authApi.me();
    window.store.set({ user: user });
    loadAvatar(user);
    chatServices.get();
  } catch (responsError) {
    // Перебрасываем ошибку дальше, чтобы login мог её обработать
    if (throwOnError) {
      // Только если явно запрошено — пробрасываем ошибку
      throw responsError;
    }
    else
    {
      window.router.go(PATH.login);
    }
  } finally {
    window.store.set({ isLoading: false });
  }
};


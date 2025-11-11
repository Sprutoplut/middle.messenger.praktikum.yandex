import ResourcesApi from '../api/resources';
import {
  StoreState, UserDTO,
} from '../api/type';
import { isApiError } from '../utils/isApiError';
import { changeAvatar } from './users';

const resourcesApi = new ResourcesApi();

export const loadAvatar = async (model: UserDTO) => {
  window.store.set({ isLoading: true });
  try {
    // const avatar = await resourcesApi.getResources(model.avatar);
    // window.store.set({ pathAvatar: avatar.path });
    if (model.avatar === null) {
      window.store.set({ pathAvatar: '/img/Avatar.png' });
    } else {
      window.store.set({ pathAvatar: `https://ya-praktikum.tech/api/v2/resources${model.avatar}` });
    }
    window.store.set({ isError: false, textError: '' });
  } catch (responsError) {
    window.store.set({ isError: true, textError: 'Error' });
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const saveAvatar = async (model: FormData) => {
  window.store.set({ isLoading: true });
  try {
    await resourcesApi.postResources(model);
    window.store.set({ isError: false, textError: '' });
  } catch (responsError) {
    if (isApiError(responsError)) {
      const error = await responsError.json();
      window.store.set({ isError: true, textError: error.reason });
    }
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const updateUserAvatar = async (
  formDataForSave: FormData,
  formDataForChange: FormData,
) => {
  try {
    // 1. Сохраняем аватар на сервер
    await saveAvatar(formDataForSave);

    // 2. Обновляем аватар у пользователя
    await changeAvatar(formDataForChange);

    // 3. Загружаем обновлённый аватар
    await loadAvatar((window.store.getState() as StoreState).user as UserDTO);
  } catch (error) {

  }
};

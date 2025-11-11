import HTTPTransport from '../core/httpTransport';
import {
  Resource,
} from './type';

const authApi = new HTTPTransport('resources');

export default class ResourcesApi {
  async getResources(data: string): Promise<Resource> {
    return authApi.get(data);
  }

  async postResources(data: FormData): Promise<Resource> {
    return authApi.post('', { data });
  }
}

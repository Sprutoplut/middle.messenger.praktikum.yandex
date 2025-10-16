import { LabelBig, LabelLogin } from '../../components';
import Block from '../../core/block';

export default class Error404Page extends Block {
  constructor() {
    super('div', {
      LabelBig: new LabelBig({
        text: '404',
      }),
      LabelLogin: new LabelLogin({
        text: 'Не туда попали',
      }),
    });
  }

  public render(): string {
    return `
            {{{LabelBig}}}
            {{{LabelLogin}}}
        `;
  }
}

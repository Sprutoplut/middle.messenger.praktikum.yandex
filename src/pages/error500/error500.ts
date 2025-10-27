import { LabelBig, LabelLogin } from '../../components';
import Block from '../../core/block';

export default class Error500Page extends Block {
  constructor() {
    super('div', {
      LabelBig: new LabelBig({
        text: '500',
      }),
      LabelLogin: new LabelLogin({
        text: 'Мы уже фиксим',
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

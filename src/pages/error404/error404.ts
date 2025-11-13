import { LabelBig, LabelLogin } from '../../components';
import Block from '../../core/block';
import withRouter from '../../utils/withRouter';

class Error404Page extends Block {
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

export default withRouter(Error404Page);

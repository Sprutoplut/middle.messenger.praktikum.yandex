import { LabelLogin, LinkLogin } from '../../components';
import Block from '../../core/block';

type LoginLayoutProps = {
    nameForm:string;
    body: Block;
    textLink: string;
    href: string;
}

export default class LoginLayout extends Block {
  constructor(props:LoginLayoutProps) {
    super('section', {
      ...props,
      className: 'section__login',
      LabelLogin: new LabelLogin({
        text: props.nameForm,
      }),
      LinkLogin: new LinkLogin({
        text: props.textLink,
        href: props.href,
      }),
    });
  }

  public render(): string {
    return `
            <div class="div__login">
                {{{LabelLogin}}}
                {{{body}}}
                {{{LinkLogin}}}
            </div>
        `;
  }
}

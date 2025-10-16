import { LinkLogin } from '../../components';
import Block from '../../core/block';

type ErrorLayoutProps = {
    body: Block;
    textLink: string;
}

export default class ErrorLayout extends Block {
  constructor(props:ErrorLayoutProps) {
    super('section', {
      ...props,
      className: 'section__error',
      LinkLogin: new LinkLogin({
        text: props.textLink,
      }),
    });
  }

  public render(): string {
    return `
            {{{body}}}
            {{{LinkLogin}}}
        `;
  }
}

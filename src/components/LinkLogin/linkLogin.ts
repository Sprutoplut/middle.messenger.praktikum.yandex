import Block from '../../core/block';

type LinkLoginProps = {
    text: string;
    href: string;
}

export default class LinkLogin extends Block {
  constructor(props:LinkLoginProps) {
    super('a', {
      ...props,
      className: 'link__login',
      attrs: {
        href: props.href,
      },
    });
  }

  render(): string {
    return `
                {{text}}
        `;
  }
}

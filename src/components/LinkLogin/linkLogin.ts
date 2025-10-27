import Block from '../../core/block';

type LinkLoginProps = {
    text: string;
}

export default class LinkLogin extends Block {
  constructor(props:LinkLoginProps) {
    super('a', {
      ...props,
      className: 'link__login',
      attrs: {
        href: '#',
      },
    });
  }

  render(): string {
    return `
                {{text}}
        `;
  }
}

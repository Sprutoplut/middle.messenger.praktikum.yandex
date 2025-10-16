import Block from '../../../../core/block';

type LinkProfileProps = {
    text?: string;
}

export default class LinkProfile extends Block {
  constructor(props: LinkProfileProps) {
    super('div', {
      ...props,
      className: 'profile__row_link',
    });
  }

  public render(): string {
    return `
            <a href="#" class="profile__link">{{text}}</a>
        `;
  }
}

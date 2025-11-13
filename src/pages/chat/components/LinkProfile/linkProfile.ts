import Block from '../../../../core/block';

type LinkProfileProps = {
    onClick?: (e: Event) => void;
}

export default class LinkProfile extends Block {
  constructor(props: LinkProfileProps) {
    super('a', {
      ...props,
      events: {
        click: props.onClick,
      },
    });
  }

  public render(): string {
    return `
            Профиль
            <img src="/img/ProfileArrow.png" alt="">
        `;
  }
}

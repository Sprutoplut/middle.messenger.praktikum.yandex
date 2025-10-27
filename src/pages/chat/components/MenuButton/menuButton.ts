import Block from '../../../../core/block';

type MenuButtonProps = {
    onClick?: () => void;
}

export default class MenuButton extends Block {
  constructor(props: MenuButtonProps) {
    super('button', {
      ...props,
      className: 'menu__button',
      events: {
        click: props.onClick,
      },
    });
  }

  public render(): string {
    return `
                <img src="/img/Menu.png" alt="">
        `;
  }
}

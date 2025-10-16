import Block from '../../../../core/block';

type ButtonAvatarProps = {
    onClick?: (e: Event) => void;
}

export default class ButtonAvatar extends Block {
  constructor(props: ButtonAvatarProps) {
    super('button', {
      ...props,
      className: 'button__avatar',
      events: {
        click: props.onClick,
      },
    });
  }

  public render(): string {
    return `
            <div class="place__avatar">
                <p>Поменять<br>аватар</p>
            </div>
        `;
  }
}

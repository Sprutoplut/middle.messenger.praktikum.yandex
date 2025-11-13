import Block from '../../../../core/block';

type ButtonCreateProps = {
    onClick?: (e: Event) => void;
}

export default class ButtonCreate extends Block {
  constructor(props: ButtonCreateProps) {
    super('button', {
      ...props,
      className: 'button__popup_append',
      events: {
        click: props.onClick,
      },
    });
  }

  public render(): string {
    return `
          Создать
        `;
  }
}

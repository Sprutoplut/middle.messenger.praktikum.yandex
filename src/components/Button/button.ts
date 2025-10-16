import Block from '../../core/block';

type ButtonProps = {
    buttonID?: string;
    text?: string;
    onClick?: (e: any) => void;
}

export default class Button extends Block {
  constructor(props: ButtonProps) {
    super('button', {
      ...props,
      className: 'button__big',
      events: {
        click: props.onClick,
      },
      attrs: {
        type: 'submit',
        id: props.buttonID,
      },
    });
  }

  public render(): string {
    return `
            {{text}}
        `;
  }
}

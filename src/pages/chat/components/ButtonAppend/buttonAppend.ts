import Block from '../../../../core/block';

type ButtonAppendProps = {
    buttonID?: string;
    text?: string;
    onClick?: () => void;
    icon?: string;
}

export default class ButtonAppend extends Block {
  constructor(props: ButtonAppendProps) {
    super('button', {
      ...props,
      className: 'button__popup_append',
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
            <img class="button__popup__icon" src={{icon}}>
            <p>{{text}}</p>
        `;
  }
}

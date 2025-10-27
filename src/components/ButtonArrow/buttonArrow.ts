import Block from '../../core/block';

type ButtonArrowProps = {
    direction?: string;
    submit?: string;
    onClick?: (e: Event) => void;
}

export default class ButtonArrow extends Block {
  constructor(props: ButtonArrowProps) {
    super('button', {
      ...props,
      className: 'button__arrow',
      events: {
        click: props.onClick,
      },
      attrs: {
        type: props.submit,
      },
    });
  }

  public render(): string {
    return `
            <img class="arrow arrow__{{direction}}" src="/img/Arrow.png" alt="Стрелка">
        `;
  }
}

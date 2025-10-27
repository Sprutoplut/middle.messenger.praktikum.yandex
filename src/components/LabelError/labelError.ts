import Block from '../../core/block';

type LabelErrorProps = {
    text?: string;
}

export default class LabelError extends Block {
  constructor(props: LabelErrorProps) {
    super('p', {
      ...props,
      className: 'p__error',
    });
  }

  public render(): string {
    return `
            {{text}}
        `;
  }
}

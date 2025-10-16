import Block from '../../core/block';

type LabelBigProps = {
    text?: string;
}

export default class LabelBig extends Block {
  constructor(props: LabelBigProps) {
    super('h1', {
      ...props,
      className: 'h1__big',
    });
  }

  public render(): string {
    return `
            {{text}}
        `;
  }
}

import Block from '../../core/block';

type LabelLoginProps = {
    text: string;
}

export default class LabelLogin extends Block {
  constructor(props:LabelLoginProps) {
    super('h1', {
      ...props,
      className: 'h1__login',
    });
  }

  public render(): string {
    return `
                {{text}}
        `;
  }
}

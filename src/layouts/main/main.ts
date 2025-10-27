import Block from '../../core/block';

type MainLayoutProps = {
    body: Block
}

export default class MainLayout extends Block {
  constructor(props:MainLayoutProps) {
    super('section', {
      ...props,
      className: 'section__main',
    });
  }

  public render(): string {
    return `
            {{{body}}}
        `;
  }
}

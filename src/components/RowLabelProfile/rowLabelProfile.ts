import Block from '../../core/block';

type RowLabelProfileProps = {
    name?: string;
    value?: string;
}

export default class RowLabelProfile extends Block {
  constructor(props: RowLabelProfileProps) {
    super('div', {
      ...props,
      className: 'profile__row',
    });
  }

  public render(): string {
    return `
            <p class="profile__name">{{name}}</p>
            <p class="profile__value">{{value}}</p>
        `;
  }
}

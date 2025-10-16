import Block from '../../core/block';
import Input from './input';
import InputRead from './inputRead';

type RowInputProfileProps = {
    name: string;
    nameValue: string;
    value?: string;
    type: string;
    autocomplete?: string;
    readonly?: boolean;
    onBlur?: () => void;
}

export default class RowInputProfile extends Block {
  constructor(props: RowInputProfileProps) {
    super('div', {
      ...props,
      className: 'profile__row',
      Input: new Input({
        name: props.nameValue,
        type: props.type,
        autocomplete: props.autocomplete,
        value: props.value,
        events: {
          blur: props.onBlur,
        },
      }),
      InputRead: new InputRead({
        name: props.nameValue,
        type: props.type,
        value: props.value,
      }),
    });
  }

  public render(): string {
    return `
            <p class="profile__name">{{name}}</p>
            {{#if readonly}}
                {{{InputRead}}}
            {{else}}
                {{{Input}}}
            {{/if}}
        `;
  }
}

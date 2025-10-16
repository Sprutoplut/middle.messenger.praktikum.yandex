import Block from '../../core/block';
import Input from './input';

type InputLoginProps =
{
    text: string;
    name: string;
    type: string;
    autocomplete?: string;
    required?: string;
    onBlur?: () => void;
}

export default class InputLogin extends Block {
  constructor(props:InputLoginProps) {
    super('div', {
      ...props,
      className: 'input__box',
      Input: new Input({
        text: props.text,
        name: props.name,
        type: props.type,
        autocomplete: props.autocomplete,
        required: props.required,
        events: {
          blur: props.onBlur,
        },
      }),
    });
  }

  public render(): string {
    return `
                {{{Input}}}    
                <label for="{{name}}">{{text}}</label>
        `;
  }
}

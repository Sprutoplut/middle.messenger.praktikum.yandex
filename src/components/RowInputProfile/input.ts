import Block from '../../core/block';

type InputProps = {
    name: string;
    type: string;
    autocomplete?: string;
    value?: string | null;
    onBlur?: () => void;
};

export default class Input extends Block {
  constructor(props: InputProps) {
    super('input', {
      ...props,
      className: 'profile__value',
      attrs: {
        name: props.name,
        type: props.type,
        autocomplete: props.autocomplete,
        required: 'required',
        value: props.value,
      },
    });
  }
}

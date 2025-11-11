import Block from '../../core/block';

type InputProps = {
    text?: string;
    name: string;
    type: string;
    autocomplete?: string;
    required?: string;
    events?: {
      blur?: (e: Event) => void;
    };
};

export default class Input extends Block {
  constructor(props: InputProps) {
    super('input', {
      ...props,
      attrs: {
        placeholder: props.text,
        name: props.name,
        type: props.type,
        autocomplete: props.autocomplete,
        required: props.required,
      },
    });
  }
}

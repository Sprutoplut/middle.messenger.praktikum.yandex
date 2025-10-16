import Block from '../../../../core/block';

type InputProps = {
    onBlur?: (e: any) => void;
};

export default class InputMessage extends Block {
  constructor(props: InputProps) {
    super('input', {
      ...props,
      className: 'input__message',
      events: {
        blur: props.onBlur,
      },
      attrs: {
        name: 'message',
        id: 'message',
        placeholder: 'Сообщение',
        type: 'text',
        required: 'required',
      },
    });
  }
}

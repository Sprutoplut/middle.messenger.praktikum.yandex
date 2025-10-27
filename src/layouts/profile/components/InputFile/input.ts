import Block from '../../../../core/block';

type InputProps = {
    events?: {
      change?: (e: Event) => void;
    };
};

export default class Input extends Block {
  constructor(props: InputProps) {
    super('input', {
      ...props,
      attrs: {
        name: 'avatar',
        type: 'file',
        id: 'popup_file',
        accept: '.jpg,.jpeg,.png',
        required: 'required',
      },
    });
  }
}

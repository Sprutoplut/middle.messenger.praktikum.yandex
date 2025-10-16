import { ButtonArrow } from '../../../../components';
import Block from '../../../../core/block';
import InputMessage from './inputMessage';

type FormProps = {
    onBlur?: (e: any) => void;
    onSubmit?: (e: any) => void;
};

export default class FormMessage extends Block {
  constructor(props: FormProps) {
    super('form', {
      ...props,
      className: 'chat__message__footer',
      events: {
        submit: props.onSubmit,
      },
      ButtonArrow: new ButtonArrow({
        direction: 'right',
        submit: 'submit',
      }),
      InputMessage: new InputMessage({
        onBlur: props.onBlur,
      }),
    });
  }

  public render(): string {
    return `
            {{{InputMessage}}}
            {{{ButtonArrow}}}
        `;
  }
}

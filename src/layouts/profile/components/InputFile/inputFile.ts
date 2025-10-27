import Block from '../../../../core/block';
import Input from './input';

type InputFileProps =
{
    onChange?: (e: Event) => void;
}

export default class InputFile extends Block {
  constructor(props:InputFileProps) {
    super('label', {
      ...props,
      className: 'input__file',
      Input: new Input({
        events: {
          change: props.onChange,
        },
      }),
    });
  }

  public render(): string {
    return `
                Выбрать файл на<br>компьютере
                {{{Input}}}    
        `;
  }
}

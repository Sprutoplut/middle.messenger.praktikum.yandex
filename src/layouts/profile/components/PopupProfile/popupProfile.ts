import Block from '../../../../core/block';
import InputFile from '../InputFile';

type PopupProfileProps = {
    nameFile?: string;
    onChange?: (e: any) => void;
}

export default class PopupProfile extends Block {
  constructor(props: PopupProfileProps) {
    super('div', {
      ...props,
      InputFile: new InputFile({
        onChange: props.onChange,
      }),
    });
  }

  public render(): string {
    return `
            {{#if nameFile}}
                <p>{{nameFile}}</p>
            {{else}}
                {{{InputFile}}}
            {{/if}}
        `;
  }
}

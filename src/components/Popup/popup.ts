import Block from '../../core/block';
import Button from '../Button';

type PopupProps = {
    formID?: string;
    enctype?: string;
    red?: string;
    title?: string;
    partial_block?: Block;
    textError?: string;
    buttonText?: string;
    buttonID?: string;
    LabelError?: Block;
    onClick?: (e: any) => void;
    onClickPopup?: (e: any) => void;
}

export default class Popup extends Block {
  constructor(props: PopupProps) {
    super('div', {
      ...props,
      className: 'dialog-container',
      Button: new Button({
        buttonID: props.buttonID,
        text: props.buttonText,
        onClick: props.onClick,
      }),
      events:
            {
              click: props.onClickPopup,
            },
    });
  }

  setButtonText(newText: string) {
    this.children.Button.setProps({ text: newText });
  }

  setLabelText(newText: string) {
    this.children.LabelError.setProps({ text: newText });
  }

  public render(): string {
    return `
            <form class="dialog" id="{{formID}}" enctype="{{enctype}}">
                <h2 class="dialog__title title__{{red}}">{{title}}</h2>
                <div class="dialog__body">
                    {{{partial_block}}}
                </div>
                <div class="dialog__footer"> 
                    {{#if textError}}
                        {{{LabelError}}}
                    {{/if}}
                    {{{Button}}}
                </div>
            </form>
        `;
  }
}

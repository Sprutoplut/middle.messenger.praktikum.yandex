import { StoreState } from '../../api/type';
import Block from '../../core/block';
import connect from '../../utils/connect';
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
    onClick?: (e: Event) => void;
    onClickPopup?: (e: Event) => void;
}

class Popup extends Block {
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
    if (this.children.Button instanceof Block) this.children.Button.setProps({ text: newText });
  }

  setLabelText(newText: string) {
    if (this.children.LabelError instanceof Block) {
      this.children.LabelError.setProps(
        { textError: newText },
      );
    }
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

const mapStateToProps = (state: StoreState) => ({
  textError: state.textError,
});

export default connect(mapStateToProps)(Popup);

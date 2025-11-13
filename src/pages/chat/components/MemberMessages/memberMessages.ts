import { MemberMessagesProps, StoreState } from '../../../../api/type';
import Block from '../../../../core/block';
import connect from '../../../../utils/connect';

class MemberMessages extends Block {
  constructor(props: MemberMessagesProps) {
    super('div', {
      ...props,
      className: 'chat__message__content',
    });
  }

  render() {
    return `
            {{#each messagesBlock}}
                <div class="message__date__group">
                    <p class="chat__date">{{this.dateBlock}}</p>
                    {{#each this.messages}}
                        <div class="message__row  message_row_{{this.author}}">
                            <div class="message__box">
                                <p class="message__row-message">{{this.message}}
                                    <span class="message__row-time">
                                        {{this.time}}
                                    </span>
                                    {{#unless this.author}}
                                        <img class="message__row-read" src="/img/{{this.read}}.png" alt="">
                                    {{/unless}}
                                </p>
                            </div>
                        </div>
                    {{/each}}
                    
                </div>
            {{/each}}
        `;
  }
}

const mapStateToProps = (state: StoreState) => ({
  messagesBlock: state.messagesBlock || [], // только это поле
});

export default connect(mapStateToProps)(MemberMessages);

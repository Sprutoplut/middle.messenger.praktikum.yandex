import { ChatDTO, MemberListProps } from '../../../../api/type';
import Block from '../../../../core/block';


export default class MemberList extends Block {
  constructor(props: MemberListProps) {
    super('li', {
      ...props,
      className: 'chat__list__member__li',
      events: {
        click: props.onClick,
      },
    });
  }

  public render(): string {
    return `
        <div class="chat__list__member list__member__{{check}}">
            <img src={{MemberPhoto}} alt="">
            <div class="chat__list__member__content">
                <p class="member-name">{{MemberName}}</p>
                {{#if LastMessageDate}}
                    <p class="last-message">
                        {{#if LastMessageWho}}
                            <span>{{LastMessageWho}}: </span>
                        {{/if}}
                        {{LastMessage}}
                    </p>
                {{/if}}
            </div>
            <div class="chat__list__member__dop">
                <p class="message-date">{{LastMessageDate}}</p>
                {{#if CountNoReadMessage}}
                    <p class="message-count">{{CountNoReadMessage}}</p>
                {{/if}}
            </div>
        </div>
        `;
  }
}

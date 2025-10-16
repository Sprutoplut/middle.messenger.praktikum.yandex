import Block from '../../../../core/block';
import ButtonAppend from '../ButtonAppend';

type PeopleChatProps = {
    onClickAppend?: () => void,
    onClickRemove?: () => void,
}

export default class PeopleChat extends Block {
  constructor(props: PeopleChatProps) {
    super('div', {
      ...props,
      className: 'popup_people',
      ButtonAppend: new ButtonAppend({
        buttonID: 'people_append',
        icon: '/img/Append.png',
        text: 'Добавить пользователя',
        onClick: props.onClickAppend,
      }),
      ButtonRemove: new ButtonAppend({
        buttonID: 'people_remove',
        icon: '/img/Remove.png',
        text: 'Удалить пользователя',
        onClick: props.onClickRemove,
      }),
    });
  }

  public render(): string {
    return `
            {{{ButtonAppend}}}
            {{{ButtonRemove}}}
        `;
  }
}

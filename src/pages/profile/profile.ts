import { RowLabelProfile } from '../../components';
import Block from '../../core/block';

type ProfilePageProps = {
    value: Array<string>;
}

export default class ProfilePage extends Block {
  constructor(props:ProfilePageProps) {
    super('div', {
      ...props,
      className: 'profile__list',
      RowLabelProfileEmail: new RowLabelProfile({
        name: 'Почта',
        value: props.value[0],
      }),
      RowLabelProfileLogin: new RowLabelProfile({
        name: 'Логин',
        value: props.value[1],
      }),
      RowLabelProfileName: new RowLabelProfile({
        name: 'Имя',
        value: props.value[2],
      }),
      RowLabelProfileSecondName: new RowLabelProfile({
        name: 'Фамилия',
        value: props.value[3],
      }),
      RowLabelProfileNameChat: new RowLabelProfile({
        name: 'Имя в чате',
        value: props.value[4],
      }),
      RowLabelProfilePhone: new RowLabelProfile({
        name: 'Телефон',
        value: props.value[5],
      }),
    });
  }

  public render(): string {
    return `
            {{{ RowLabelProfileEmail}}}
            {{{ RowLabelProfileLogin}}}
            {{{ RowLabelProfileName}}}
            {{{ RowLabelProfileSecondName}}}
            {{{ RowLabelProfileNameChat}}}
            {{{ RowLabelProfilePhone}}}
        `;
  }
}

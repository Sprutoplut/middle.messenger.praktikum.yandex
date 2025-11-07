import { UserDTO } from '../../api/type';
import { RowLabelProfile } from '../../components';
import Block from '../../core/block';
import { connect } from '../../utils/connect';


type ProfilePageProps = {
    user: UserDTO;
}

class ProfilePage extends Block {
  constructor(props:ProfilePageProps) {
    super('div', {
      ...props,
      className: 'profile__list',
      RowLabelProfileEmail: new RowLabelProfile({
        name: 'Почта',
        user: props.user,
        field: "email",
      }),
      RowLabelProfileLogin: new RowLabelProfile({
        name: 'Логин',
        user: props.user,
        field: "login",
      }),
      RowLabelProfileName: new RowLabelProfile({
        name: 'Имя',
        user: props.user,
        field: "first_name",
      }),
      RowLabelProfileSecondName: new RowLabelProfile({
        name: 'Фамилия',
        user: props.user,
        field: "second_name",
      }),
      RowLabelProfileNameChat: new RowLabelProfile({
        name: 'Имя в чате',
        user: props.user,
        field: "display_name",
      }),
      RowLabelProfilePhone: new RowLabelProfile({
        name: 'Телефон',
        user: props.user,
        field: "phone",
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

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(ProfilePage);
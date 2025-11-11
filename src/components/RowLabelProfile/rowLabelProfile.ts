import { StoreState, UserDTO } from '../../api/type';
import Block from '../../core/block';
import connect from '../../utils/connect';

type RowLabelProfileProps = {
    name?: string;
    user: UserDTO; // Теперь получаем user целиком
    field: keyof UserDTO; // Ключ поля (email, login и т. д.)
}

class RowLabelProfile extends Block {
  constructor(props: RowLabelProfileProps) {
    super('div', {
      ...props,
      className: 'profile__row',
    });
  }

  public render(): string {
    const { user, field } = this.props;
    const value = (user as UserDTO)[field as keyof UserDTO] ?? ''; // Извлекаем значение по ключу
    return `
            <p class="profile__name">{{name}}</p>
            <p class="profile__value">${value}</p>
        `;
  }
}

const mapStateToProps = (state: StoreState) => ({
  user: state.user,
});

export default connect(mapStateToProps)(RowLabelProfile);

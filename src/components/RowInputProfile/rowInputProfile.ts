import { UserDTO } from '../../api/type';
import Block from '../../core/block';
import { connect } from '../../utils/connect';
import Input from './input';

type RowInputProfileProps = {
    name: string;
    nameValue: keyof UserDTO;
    user: UserDTO;     // Теперь получаем user целиком
    type: string;
    autocomplete?: string;
    empty?: boolean;
    onBlur?: (e: Event) => void;
}

class RowInputProfile extends Block {
  constructor(props: RowInputProfileProps) {
    super('div', {
      ...props,
      className: 'profile__row',
      Input: new Input({
        name: props.nameValue,
        type: props.type,
        autocomplete: props.autocomplete,
        value: props.user[props.nameValue],
        events: {
          blur: props.onBlur
        }
      })
    });
  }

  componentDidUpdate(){
    this.children.Input.setValue(this.props.user[this.props.nameValue]);
  }

  public render(): string {
    return `
      <p class="profile__name">{{name}}</p>
      {{{Input}}}
    `;
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(RowInputProfile);



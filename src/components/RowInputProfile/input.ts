import { UserDTO } from '../../api/type';
import Block from '../../core/block';
import { connect } from '../../utils/connect';

type InputProps = {
    name: keyof UserDTO;
    type: string;
    autocomplete?: string;
    value?: string | undefined; 
    user: UserDTO;
    events?: {
      blur?: (e: Event) => void;
    };
};

class Input extends Block {
  constructor(props: InputProps) {
    super('input', {
      ...props,
      className: 'profile__value',
      attrs: {
        name: props.name,
        type: props.type,
        autocomplete: props.autocomplete,
        required: 'required',
        value: props.user[props.name],
      },
    });
  }
  setValue(newText: string) {
    this.setProps({ value: newText });
    if (this.element instanceof HTMLInputElement) {
      this.element.value = newText;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Input);

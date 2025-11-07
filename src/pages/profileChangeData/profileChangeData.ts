import { UserDTO } from '../../api/type';
import { Button, LabelError, RowInputProfile } from '../../components';
import Block from '../../core/block';
import { handleInputValidation } from '../../helpers/validation';
import { connect } from '../../utils/connect';
import * as usersServices from "../../services/users";

type ProfilePageProps = {
    user: UserDTO;
    isError?: boolean;
}

class ProfilePageChangeData extends Block {
  constructor(props:ProfilePageProps) {
    super('form', {
      ...props,
      className: 'profile__list',
      inputErrors: false,
      RowInputProfileEmail: new RowInputProfile({
        name: 'Почта',
        nameValue: 'email',
        type: 'email',
        autocomplete: 'email',
        user: props.user,
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.user as Record<string, string>,
        ),
      }),
      RowInputProfileLogin: new RowInputProfile({
        name: 'Логин',
        nameValue: 'login',
        type: 'text',
        autocomplete: 'login',
        user: props.user,
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.user as Record<string, string>,
        ),
      }),
      RowInputProfileFirstName: new RowInputProfile({
        name: 'Имя',
        nameValue: 'first_name',
        type: 'text',
        autocomplete: 'given-name',
        user: props.user,
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.user as Record<string, string>,
        ),
      }),
      RowInputProfileSecondName: new RowInputProfile({
        name: 'Фамилия',
        nameValue: 'second_name',
        type: 'text',
        autocomplete: 'family-name',
        user: props.user,
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.user as Record<string, string>,
        ),
      }),
      RowInputProfileDisplayName: new RowInputProfile({
        name: 'Имя в чате',
        nameValue: 'display_name',
        type: 'text',
        autocomplete: 'given-name',
        user: props.user,
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.user as Record<string, string>,
        ),
      }),
      RowInputProfileTel: new RowInputProfile({
        name: 'Телефон',
        nameValue: 'phone',
        type: 'tel',
        autocomplete: 'tel',
        user: props.user,
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.user as Record<string, string>,
        ),
      }),
      LabelError: new LabelError({
        textError: '',
      }),
      SaveButton: new Button({
        text: 'Сохранить',
      }),
      events: {
        submit: (e: Event) => {
          e.preventDefault();

          // Выполняем полную валидацию при submit (передаем null)
          handleInputValidation( 
            null, // передаем null для полной валидации
            this.setProps.bind(this),
            this.children.LabelError,
            this.updateFormState.bind(this),
            this.props.user as Record<string, string>,
          );

          if (!this.props.isError) {
            usersServices.changeData(this.props.user);
            console.log(this.props.user);
          }
        },
      },
    });
  }

  // Функция для обновления состояния формы
  private updateFormState(fieldName: keyof typeof this.props.user, value: string) {
    this.setProps({
      user: {
        ...this.props.user as Record<string, string>,
        [fieldName]: value,
      },
    });
  }

  public render(): string {
    return `
            {{{ RowInputProfileEmail}}}
            {{{ RowInputProfileLogin}}}
            {{{ RowInputProfileFirstName}}}
            {{{ RowInputProfileSecondName}}}
            {{{ RowInputProfileDisplayName}}}
            {{{ RowInputProfileTel}}}
            <input name="avatar" id="profile-avatar" type="file">
            <div class="profile__save">
                {{#if isError}}
                    {{{LabelError}}}
                {{/if}}
                {{{SaveButton}}}
            </div>
        `;
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    isError: state.isError
  };
};

export default connect(mapStateToProps)(ProfilePageChangeData);
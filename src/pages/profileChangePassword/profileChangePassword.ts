import { ChangePasswordForm, StoreState, UserDTO } from '../../api/type';
import { Button, LabelError, RowInputProfile } from '../../components';
import Block from '../../core/block';
import { handleInputValidation } from '../../helpers/validation';
import * as usersServices from '../../services/users';
import connect from '../../utils/connect';

type ProfilePageProps = {
    isError?: boolean;
    user: UserDTO;
}

class ProfilePageChangePassword extends Block {
  constructor(props:ProfilePageProps) {
    super('form', {
      ...props,
      oldPassword: '',
      className: 'profile__list',
      formState: {
        password: '',
        oldPassword: '',
        password_repeat: '',
      },

      RowInputProfileOldPassword: new RowInputProfile({
        name: 'Старый пароль',
        nameValue: 'oldPassword',
        empty: true,
        type: 'password',
        value: '',
        user: props.user,
        onBlur: (e: Event) => {
          this.setProps({
            formState: {
              ...this.props.formState as object,
              oldPassword: e.target !== null ? (e.target as HTMLInputElement).value : '',
            },
          });
        },
      }),
      RowInputProfilePassword: new RowInputProfile({
        name: 'Новый пароль',
        nameValue: 'password',
        empty: true,
        type: 'password',
        autocomplete: 'new-password',
        user: props.user,
        value: '',
        onBlur: (e: Event) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState as Record<string, string>,
        ),
      }),
      RowInputProfileRepeatPassword: new RowInputProfile({
        name: 'Повторите новый пароль',
        nameValue: 'password_repeat',
        empty: true,
        user: props.user,
        type: 'password',
        value: '',
        onBlur: (e: Event) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState as Record<string, string>,
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
            this.props.formState as Record<string, string>,
          );

          if (!this.props.isError) {
            const releaseForm = {
              oldPassword: (this.props.formState as ChangePasswordForm).oldPassword,
              newPassword: (this.props.formState as ChangePasswordForm).password,
            };
            usersServices.changePassword(releaseForm);
            // Здесь можно добавить отправку данных на сервер
          }
        },
      },
    });
  }

  // Функция для обновления состояния формы
  private updateFormState(fieldName: keyof typeof this.props.formState, value: string) {
    this.setProps({
      formState: {
        ...this.props.formState as Record<string, string>,
        [fieldName]: value,
      },
    });
  }

  public render(): string {
    return `
            {{{ RowInputProfileOldPassword}}}
            {{{ RowInputProfilePassword}}}
            {{{ RowInputProfileRepeatPassword}}}
            <input name="avatar" id="profile-avatar" value="" type="file">
            <div class="profile__save">
                {{#if isError}}
                    {{{LabelError}}}
                {{/if}}
                {{{SaveButton}}}
            </div>
        `;
  }
}

const mapStateToProps = (state: StoreState) => ({
  user: state.user,
  isError: state.isError,
});

export default connect(mapStateToProps)(ProfilePageChangePassword);

import { Button, LabelError, RowInputProfile } from '../../components';
import Block from '../../core/block';
import { handleInputValidation } from '../../validation';

type ProfilePageProps = {
    oldPassword: string;
    isError?: boolean;
}

export default class ProfilePage extends Block {
  constructor(props:ProfilePageProps) {
    super('form', {
      ...props,
      className: 'profile__list',
      inputErrors: false,
      formState: {
        password: '',
        password_repeat: '',
      },
      RowInputProfileOldPassword: new RowInputProfile({
        name: 'Старый пароль',
        nameValue: 'oldPassword',
        type: 'password',
        readonly: true,
        value: props.oldPassword,
      }),
      RowInputProfilePassword: new RowInputProfile({
        name: 'Новый пароль',
        nameValue: 'password',
        type: 'password',
        autocomplete: 'new-password',
        value: '',
        onBlur: (e) => handleInputValidation(
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
        type: 'password',
        value: '',
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState as Record<string, string>,
        ),
      }),
      LabelError: new LabelError({
        text: '',
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
            console.log(this.props.formState);
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

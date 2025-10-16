import { InputLogin, Button, LabelError } from '../../components';
import Block from '../../core/block';
import { handleInputValidation } from '../../validation';

type LoginPageProps = {
    isError?: boolean;
}

export default class LoginPage extends Block {
  constructor(props:LoginPageProps) {
    super('form', {
      ...props,
      className: 'form__login',
      inputErrors: false,
      attrs: {
        action: '',
        id: 'loginForm',
      },
      formState: {
        login: '',
        password: '',
      },
      LabelError: new LabelError({
        text: '',
      }),
      InputLogin: new InputLogin({
        text: 'Логин',
        name: 'login',
        type: 'text',
        autocomplete: 'login',
        required: 'required',
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState as Record<string, string>,
        ),
      }),
      InputPassword: new InputLogin({
        text: 'Пароль',
        name: 'password',
        type: 'password',
        autocomplete: 'current-password',
        required: 'required',
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState as Record<string, string>,
        ),
      }),
      SignInButton: new Button({
        text: 'Авторизоваться',
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
            {{{InputLogin}}}
            {{{InputPassword}}}
            {{#if isError}}
                {{{LabelError}}}
            {{/if}}
            {{{SignInButton}}}
        `;
  }
}

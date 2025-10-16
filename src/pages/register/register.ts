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
      attrs: {
        action: '',
        id: 'registerForm',
      },
      formState: {
        login: '',
        password: '',
        email: '',
        first_name: '',
        second_name: '',
        phone: '',
        password_repeat: '',
      },
      LabelError: new LabelError({
        text: '',
      }),
      InputEmail: new InputLogin({
        text: 'Почта',
        name: 'email',
        type: 'email',
        autocomplete: 'email',
        required: 'required',
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState,
        ),
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
          this.props.formState,
        ),
      }),
      InputFirstName: new InputLogin({
        text: 'Имя',
        name: 'first_name',
        type: 'text',
        autocomplete: 'given-name',
        required: 'required',
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState,
        ),
      }),
      InputSecondName: new InputLogin({
        text: 'Фамилия',
        name: 'second_name',
        type: 'text',
        autocomplete: 'family-name',
        required: 'required',
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState,
        ),
      }),
      InputPhone: new InputLogin({
        text: 'Телефон',
        name: 'phone',
        type: 'tel',
        autocomplete: 'tel',
        required: 'required',
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState,
        ),
      }),
      InputPassword: new InputLogin({
        text: 'Пароль',
        name: 'password',
        type: 'password',
        autocomplete: 'new-password',
        required: 'required',
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState,
        ),
      }),
      InputPasswordRepeat: new InputLogin({
        text: 'Пароль (ещё раз)',
        name: 'password_repeat',
        type: 'password',
        autocomplete: 'none',
        required: 'required',
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState,
        ),
      }),
      RegisterButton: new Button({
        text: 'Зарегистрироваться',
      }),
      events: {
        submit: (e: any) => {
          e.preventDefault();

          // Выполняем полную валидацию при submit (передаем null)
          handleInputValidation(
            null, // передаем null для полной валидации
            this.setProps.bind(this),
            this.children.LabelError,
            this.updateFormState.bind(this),
            this.props.formState,
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
        ...this.props.formState,
        [fieldName]: value,
      },
    });
  }

  public render(): string {
    return `
            {{{InputEmail}}}
            {{{InputLogin}}}

            {{{InputFirstName}}}
            {{{InputSecondName}}}
            {{{InputPhone}}}
            {{{InputPassword}}}
            {{{InputPasswordRepeat}}}
            {{#if isError}}
                {{{LabelError}}}
            {{/if}}
            {{{RegisterButton}}}
        `;
  }
}

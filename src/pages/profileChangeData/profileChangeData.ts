import { Button, LabelError, RowInputProfile } from '../../components';
import Block from '../../core/block';
import { handleInputValidation } from '../../validation';

type ProfilePageProps = {
    value: Array<string>;
    isError?: boolean;
}

export default class ProfilePage extends Block {
  constructor(props:ProfilePageProps) {
    super('form', {
      ...props,
      className: 'profile__list',
      inputErrors: false,
      formState: {
        login: '',
        email: '',
        first_name: '',
        second_name: '',
        phone: '',
      },
      RowInputProfileEmail: new RowInputProfile({
        name: 'Почта',
        nameValue: 'email',
        type: 'email',
        autocomplete: 'email',
        value: props.value[0],
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState as Record<string, string>,
        ),
      }),
      RowInputProfileLogin: new RowInputProfile({
        name: 'Логин',
        nameValue: 'login',
        type: 'text',
        autocomplete: 'login',
        value: props.value[1],
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState as Record<string, string>,
        ),
      }),
      RowInputProfileFirstName: new RowInputProfile({
        name: 'Имя',
        nameValue: 'first_name',
        type: 'text',
        autocomplete: 'given-name',
        value: props.value[2],
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState as Record<string, string>,
        ),
      }),
      RowInputProfileSecondName: new RowInputProfile({
        name: 'Фамилия',
        nameValue: 'second_name',
        type: 'text',
        autocomplete: 'family-name',
        value: props.value[3],
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState as Record<string, string>,
        ),
      }),
      RowInputProfileDisplayName: new RowInputProfile({
        name: 'Имя в чате',
        nameValue: 'display_name',
        type: 'text',
        autocomplete: 'given-name',
        value: props.value[4],
        onBlur: (e) => handleInputValidation(
          e,
          this.setProps.bind(this),
          this.children.LabelError,
          this.updateFormState.bind(this),
          this.props.formState as Record<string, string>,
        ),
      }),
      RowInputProfileTel: new RowInputProfile({
        name: 'Телефон',
        nameValue: 'phone',
        type: 'tel',
        autocomplete: 'tel',
        value: props.value[5],
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

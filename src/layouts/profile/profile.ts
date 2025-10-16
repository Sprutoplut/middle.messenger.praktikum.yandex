import {
  ButtonArrow, LabelError, Popup,
} from '../../components';
import Block from '../../core/block';
import { ButtonAvatar, LinkProfile, PopupProfile } from './components';

type ProfileLayoutProps = {
    isShow?: boolean,
    body: Block,
    valueFile?: string,
    name?: string,
    change?: boolean,
    formState?: Record<string, string>,
    inputErrors?: string,
    filesInput?: FileList | null
}

export default class ProfileLayout extends Block {
  constructor(props:ProfileLayoutProps) {
    super('section', {
      ...props,
      filesInput: null,
      className: 'section__profile',
      Popup: new Popup({
        onClickPopup: (e) => {
          if (e.target === e.currentTarget) {
            this.setProps({ isShow: false });
          }
        },
        title: 'Загрузите файл',
        buttonText: 'Поменять',
        formID: 'formProfile',
        enctype: 'multipart/form-data',
        LabelError: new LabelError({
          text: 'Нужно выбрать файл',
        }),
        partial_block: new PopupProfile({
          onChange: (e) => {
            this.setProps({ filesInput: (e.target as HTMLInputElement).files });

            if (this.props.filesInput && (this.props.filesInput as FileList).length > 0) {
              const file = (this.props.filesInput as FileList)[0];
              if (this.children.Popup instanceof Block) {
                this.children.Popup.setProps({
                  title: 'Файл загружен',
                  textError: '',
                });
              }
              if (this.children.Popup instanceof Block) {
                if (this.children.Popup.children.partial_block instanceof Block) {
                  this.children.Popup.children.partial_block.setProps({
                    nameFile: file.name,
                  });
                }
              }
            } else if (this.children.Popup instanceof Block) {
              this.children.Popup.setProps({
                title: 'Ошибка, попробуйте ещё раз',
                red: 'red',
                textError: 'Нужно выбрать файл',
              });
            }
          },
        }),
        onClick: (e) => {
          e.preventDefault();
          if (this.children.Popup instanceof Block) {
            if (this.children.Popup.children.partial_block instanceof Block) {
              if (this.children.Popup.children.partial_block.props.nameFile === undefined) {
                this.children.Popup.setProps({ textError: 'Нужно выбрать файл' });
              } else {
                const avatarInput = document.querySelector('#profile-avatar') as HTMLInputElement;
                if (
                  avatarInput
              && this.props.filesInput
              && (this.props.filesInput as FileList).length > 0
                ) {
                  const file = (this.props.filesInput as FileList)[0];

                  // Проверяем, что файл существует и имеет необходимые свойства
                  if (file && file.name && file.type && file.lastModified) {
                    // Создаем новый File объект
                    const newFile = new File([file], file.name, {
                      type: file.type,
                      lastModified: file.lastModified,
                    });

                    // Создаем новый FileList
                    const fileList = new DataTransfer();
                    fileList.items.add(newFile);

                    // Устанавливаем новый FileList в целевой input
                    avatarInput.files = fileList.files;
                    console.log('Передали в скрытый input');
                  } else {
                    console.error('Неверный формат файла');
                  }
                } else {
                  console.log('Передаем сразу на сервер файл');
                  console.log(this.props.filesInput);
                }
                this.children.Popup.setProps({
                  title: 'Загрузите файл',
                  red: '',
                  textError: '',
                });
                this.children.Popup.children.partial_block.setProps({
                  nameFile: '',
                });
                this.setProps({ isShow: false });
              }
            }
          }
        },
      }),
      ButtonArrow: new ButtonArrow({
        onClick: (e) => {
          e.preventDefault();
          console.log('Нажатие');
        },
      }),
      ButtonAvatar: new ButtonAvatar({
        onClick: (e) => {
          e.preventDefault();
          this.setProps({ isShow: true });
          const popupFile = document.querySelector('#popup_file') as HTMLInputElement;
          popupFile.value = '';
          if (this.children.Popup instanceof Block) {
            if (this.children.Popup.children.partial_block instanceof Block) {
              this.children.Popup.children.partial_block.setProps({ nameFile: undefined });
            }
          }
        },
      }),
      LinkProfileData: new LinkProfile({
        text: 'Изменить данные',
      }),
      LinkProfilePassword: new LinkProfile({
        text: 'Изменить данные',
      }),
      LinkProfileExit: new LinkProfile({
        text: 'Выйти',
      }),
    });
  }

  public render(): string {
    return `
            {{#if isShow}}
                {{{Popup}}}
            {{/if}}
            <section class="section__profile_back">
                {{{ ButtonArrow }}}
            </section>
            <section class="section__profile__main">
                <div class="profile__container">
                    <div class="profile__header">
                        {{{ButtonAvatar}}}
                        {{#unless change}}
                            <p class="profile__my_name">{{name}}</p>
                        {{/unless}}
                    </div>
                    <div class="profile__body">
                        {{{body}}}
                        <div class="profile__footer">
                            {{#unless change}}
                                {{{LinkProfileData}}}
                                {{{LinkProfilePassword}}}
                                {{{LinkProfileExit}}}
                            {{/unless}}
                        </div>
                    </div>
                </div>
            </section>
        `;
  }
}

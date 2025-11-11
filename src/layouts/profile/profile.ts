import {
  ButtonArrow, LabelError, Popup,
} from '../../components';
import Block from '../../core/block';
import { ProfileChangeDataPage, ProfileChangePasswordPage, ProfilePage } from '../../pages';
import { ButtonAvatar, LinkProfile, PopupProfile } from './components';
import * as authServices from '../../services/auth';
import withRouter from '../../utils/withRouter';
import PATH from '../../helpers/path';
import { StoreState, UserDTO } from '../../api/type';
import connect from '../../utils/connect';
import { updateUserAvatar } from '../../services/resources';

type ProfileLayoutProps = {
    isShow?: boolean,
    valueFile?: string,
    name?: string,
    change?: boolean,
    profile?: boolean,
    profileData?: boolean,
    formState?: Record<string, string>,
    inputErrors?: string,
    filesInput?: FileList | null,
    oldPassword?: string,
    user?: UserDTO,
}

class ProfileLayout extends Block {
  constructor(props:ProfileLayoutProps) {
    super('section', {
      ...props,
      filesInput: null,
      className: 'section__profile',
      profile: true,
      profileData: false,
      bodyProfile: new ProfilePage({}),
      bodyProfileData: new ProfileChangeDataPage({}),
      bodyProfilePassword: new ProfileChangePasswordPage({
      }),
      Popup: new Popup({
        onClickPopup: (e: Event) => {
          if (e.target === e.currentTarget) {
            this.setProps({ isShow: false });
          }
        },
        title: 'Загрузите файл',
        buttonText: 'Поменять',
        formID: 'formProfile',
        enctype: 'multipart/form-data',
        LabelError: new LabelError({
          textError: 'Нужно выбрать файл',
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
        onClick: (e: Event) => {
          e.preventDefault();
          if (this.children.Popup instanceof Block) {
            if (this.children.Popup.children.partial_block instanceof Block) {
              if (this.children.Popup.children.partial_block.props.nameFile === undefined) {
                this.children.Popup.setProps({ textError: 'Нужно выбрать файл' });
              } else {
                const formData = new FormData();
                formData.append('avatar', (this.props.filesInput as FileList)[0]); // ключевое поле API
                const formData2 = new FormData();
                formData2.append('resource', (this.props.filesInput as FileList)[0]); // ключевое поле API
                updateUserAvatar(formData2, formData);
                this.setProps({ isShow: false });
                this.children.Popup.setProps({
                  title: 'Загрузите файл',
                  red: '',
                  textError: '',
                });
                this.children.Popup.children.partial_block.setProps({
                  nameFile: '',
                });
              }
            }
          }
        },
      }),
      ButtonArrow: new ButtonArrow({
        onClick: (e) => {
          e.preventDefault();
          this.setProps({ profile: true, change: false });
          window.router.go(PATH.chat);
        },
      }),
      ButtonAvatar: new ButtonAvatar({
        onClick: (e: Event) => {
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
        onClick: (e) => {
          e.preventDefault();
          this.setProps({ profileData: true, profile: false, change: true });
        },
      }),
      LinkProfilePassword: new LinkProfile({
        text: 'Изменить пароль',
        onClick: (e) => {
          e.preventDefault();
          this.setProps({ profileData: false, profile: false, change: true });
        },
      }),
      LinkProfileExit: new LinkProfile({
        text: 'Выйти',
        onClick: (e) => {
          e.preventDefault();
          authServices.logout();
        },
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
                            <p class="profile__my_name">{{user.first_name}}</p>
                        {{/unless}}
                    </div>
                    <div class="profile__body">
                        {{#if profile}}
                          {{{bodyProfile}}}
                        {{else}}
                          {{#if profileData}}
                            {{{bodyProfileData}}}
                          {{else}}
                            {{{bodyProfilePassword}}}
                          {{/if}}
                        {{/if}}
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

const mapStateToProps = (state: StoreState) => ({
  user: state.user,
});

export default connect(mapStateToProps)(withRouter(ProfileLayout));

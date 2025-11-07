import { InputLogin, LabelError, Popup } from '../../components';
import Block from '../../core/block';
import { PATH } from '../../helpers/path';
import { handleInputValidation } from '../../helpers/validation';
import { connect } from '../../utils/connect';
import { protectedRoute } from '../../utils/protectedRoute';
import { withRouter } from '../../utils/withRouter';
import { MemberMessages, ButtonCreate, LinkProfile, MemberList, PeopleChat } from './components';
import FormMessage from './components/FormMessage';
import MenuButton from './components/MenuButton';
import * as chatServices from "../../services/chat";
import { ChatDTO, MemberListProps, messagesBlock } from '../../api/type';





type ChatPageProps = {
    isContextMenu?: boolean;
    isShow?: boolean;
    isShowCreate?: boolean;
    members: MemberListProps[];
    messagesBlock: messagesBlock[];
}

class ChatPage extends Block {
  constructor(props: ChatPageProps) {
    super('section', {
      ...props,
      className: 'section__chat',
      Activeindex: -1,
      formState:
            {
              login: '',
            },
      formStateCreate: {
        title: '',
      },
      messageState: '',
      ButtonCreate: new ButtonCreate({
        onClick: (e) =>
        {
          e.preventDefault();
          this.setProps({ isShowCreate: true });
        }
      }),
      LinkProfile: new LinkProfile({
        onClick: (e) => {
          e.preventDefault();
          window.router.go(PATH.profile);
        },
      }),
      PeopleChat: new PeopleChat({
        onClickAppend: () => {
          this.setProps({ isShow: true });
          (this.children.Popup as Popup).setButtonText('Добавить');
          if (this.children.Popup instanceof Block) this.children.Popup.setProps({ formID: 'formPeopleAdd', title: 'Добавить пользователя' });
        },
        onClickRemove: () => {
          this.setProps({ isShow: true });
          (this.children.Popup as Popup).setButtonText('Удалить');
          if (this.children.Popup instanceof Block) this.children.Popup.setProps({ formID: 'formPeopleRemove', title: 'Удалить пользователя' });
        },
      }),
      PopupCreate: new Popup({
        title: "Создание чата",
        buttonText: "Создать",
        onClickPopup: (e) => {
          if (e.target === e.currentTarget) {
            this.setProps({ isShowCreate: false});
          }
        },
        LabelError: new LabelError({}),
        partial_block: new InputLogin({
          name: 'title',
          text: 'Название чата',
          type: 'text',
          required: 'required',
          autocomplete: 'none',
          onBlur: (e) => {
            const target = e.target as HTMLInputElement | null; // Явный каст
            this.updateFormStateCreate(
              (e.target as HTMLInputElement).name as keyof typeof this.props.formStateCreate,
              (e.target as HTMLInputElement).value,
            );
          },
        }),
        onClick: (e) => {
          e.preventDefault();
          chatServices.create(this.props.formStateCreate);
        },
      }),
      Popup: new Popup({
        onClickPopup: (e) => {
          if (e.target === e.currentTarget) {
            this.setProps({ isShow: false, isContextMenu: false });
          }
        },
        LabelError: new LabelError({}),
        partial_block: new InputLogin({
          name: 'login',
          text: 'Логин',
          type: 'text',
          required: 'required',
          autocomplete: 'none',
          onBlur: (e) => {
            const target = e.target as HTMLInputElement | null; // Явный каст

            if (!target || !target.value) {
              return; // Защита от null и отсутствия value
            }

            const { value } = target;
            const loginRegex = /^[a-zA-Z0-9_-]+$/;
            const digitsOnly = /^\d+$/;
            // Проверяем длину
            if (this.children.Popup instanceof Block) {
              if (value.length < 3 || value.length > 20) {
                this.children.Popup.setProps({ textError: 'true' });
                (this.children.Popup as Popup).setLabelText('Логин должен содержать от 3 до 20 символов');
              } else if (!loginRegex.test(value)) {
                this.children.Popup.setProps({ textError: 'true' });
                (this.children.Popup as Popup).setLabelText('Логин содержит недопустимые символы');
              } else if (digitsOnly.test(value)) {
                this.children.Popup.setProps({ textError: 'true' });
                (this.children.Popup as Popup).setLabelText('Логин не может состоять только из цифр');
              } else {
                this.children.Popup.setProps({ textError: '' });
                (this.children.Popup as Popup).setLabelText('');
              }
            }
            this.updateFormState(
              (e.target as HTMLInputElement).name as keyof typeof this.props.formState,
              (e.target as HTMLInputElement).value,
            );
          },
        }),
        onClick: (e) => {
          e.preventDefault();
          handleInputValidation(
            null, // передаем null для полной валидации
            this.setProps.bind(this),
            (this.children.Popup as Block).children.LabelError,
            this.updateFormState.bind(this),
            this.props.formState as Record<string, string>,
          );
          if (!this.props.isError) {
            if (this.children.Popup instanceof Block) {
              if (this.children.Popup.props.title === 'Добавить пользователя') {
                console.log('Добавление пользователя');
              } else {
                console.log('Удаление пользователя');
              }
            }
            console.log(this.props.formState);
            this.setProps({ isShow: false, isContextMenu: false });
          }
        },
      }),
      membersComp: props.members.map(
        (props2, index) => new MemberList({
          ...props2,
          onClick: () => {
            this.setProps({
              Activeindex: index,
            });
          },
        }),
      ),
      MemberMessages: new MemberMessages({}),
      MenuButton: new MenuButton({
        onClick: () => {
          if (this.props.isContextMenu === true) {
            this.setProps({ isContextMenu: false });
          } else {
            this.setProps({ isContextMenu: true });
          }
        },
      }),
      FormMessage: new FormMessage({
        onSubmit: (e) => {
          e.preventDefault();
          if (this.props.messageState !== '') {
            console.log(this.props.messageState);
            this.setProps({ isShow: false, isContextMenu: false });
          }
        },
        onBlur: (e) => {
          this.setProps({ messageState: (e.target as HTMLInputElement).value });
        },
      }),
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
  private updateFormStateCreate(fieldName: keyof typeof this.props.formStateCreate, value: string) {
    this.setProps({
      formStateCreate: {
        ...this.props.formStateCreate as Record<string, string>,
        [fieldName]: value,
      },
    });
  }



  render() {
    const { Activeindex } = this.props;
    const { membersComp, MemberMessages } = this.children;
    
    if (this.props.members !== undefined)
    {
    this.children.membersComp = this.props.members.map(
        (props2) => new MemberList({
          ...props2,
          onClick: () => {
            this.setProps({
              Activeindex: props2.id,
            });
          },
        }),
      );
    }
    if (membersComp !== undefined)
    {
      (membersComp as Block[]).forEach((member: Block) => {
        if (member.id === Activeindex) {
          member.setProps({ check: 'check' });
          member.setProps({ className: 'chat__list__member list__member__check' });
          return;
        }

        if (member.props.check === 'check') {
          member.setProps({ check: '' });
        }
      });
    }
    let nameMember: string | undefined = '';
    let photoMember: string | undefined = '';

    
    if (Activeindex !== -1) {
      // @ts-expect-error Не получается исправить
      const currentMember = this.props.members[Activeindex];
      /*if (MemberMessages instanceof Block) {
        MemberMessages.setProps({ messagesBlock: currentMember?.messagesBlock });
      }*/
      nameMember = currentMember?.MemberName;
      photoMember = currentMember?.MemberPhoto;
    }
    
    return `
            {{#if isContextMenu}}
                {{#if isShow}}
                    {{{Popup}}}
                {{/if}}
            {{/if}}
            {{#if isShowCreate}}
                {{{PopupCreate}}}
            {{/if}}
            <div class="chat__list">
                <div class="chat__list__header">
                  <div class="chat__list__header-a">
                    {{{ButtonCreate}}}
                    {{{LinkProfile}}}
                  </div>
                  <form id="search">
                      <input class="input__search" name="list-search" id="list-search" placeholder="Поиск" type="search">
                  </form>
                </div>
                <div class="box-list-line">
                    <div class="list-line"></div>
                </div>
                <ul class="chat__list__content">
                    {{#each membersComp}}
                        {{{this}}}
                        <div class="box-list-line">
                            <div class="list-line"></div>
                        </div>
                    {{/each}}
                </ul>
            </div>
            <div class="chat__message">
                {{#if ${Activeindex === -1}}}
                    <p>Выберите чат чтобы отправить сообщение</p>
                {{else}}
                    <div class="chat__message__header">
                        {{#if isContextMenu}}
                            {{{PeopleChat}}}
                        {{/if}}
                        <div class="chat__message__header-name">
                            <img src=${photoMember} alt="">
                            <p>${nameMember}</p>
                        </div>
                        {{{MenuButton}}}
                    </div>
                    {{{MemberMessages}}}
                    {{{FormMessage}}}
                {{/if}}
            </div>
        `;
  }
}

const mapStateToProps = (state) => {
  return {
    members: state.members,
    Activeindex: state.Activeindex,
  };
};

export default connect(mapStateToProps)(withRouter(protectedRoute(ChatPage)));
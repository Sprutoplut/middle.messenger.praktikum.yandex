import { InputLogin, LabelError, Popup } from '../../components';
import Block from '../../core/block';
import PATH from '../../helpers/path';
import { handleInputValidation } from '../../helpers/validation';
import connect from '../../utils/connect';
import withRouter from '../../utils/withRouter';
import {
  MemberMessages, ButtonCreate, LinkProfile, MemberList, PeopleChat,
} from './components';
import FormMessage from './components/FormMessage';
import MenuButton from './components/MenuButton';
import * as chatServices from '../../services/chat';
import {
  MemberListProps, messagesBlock, StoreState, UserDTO,
} from '../../api/type';
import ChatWebSocket from '../../services/websocket';
import arraysDiffer from '../../utils/arraysDiifer';

type ChatPageProps = {
    isContextMenu?: boolean;
    isShow?: boolean;
    isShowCreate?: boolean;
    members: MemberListProps[];
    messagesBlock: messagesBlock[];
    Activeindex?: number;
    formStateCreate: {
        title: string,
    };
}
class ChatPage extends Block {
  private ChatSocket = new ChatWebSocket();

  // Экземпляр сервиса
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
        onClick: (e) => {
          e.preventDefault();
          this.setProps({ isShowCreate: true });
        },
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
          if (this.children.Popup instanceof Popup) this.children.Popup.setButtonText('Добавить');
          if (this.children.Popup instanceof Block) this.children.Popup.setProps({ formID: 'formPeopleAdd', title: 'Добавить пользователя' });
        },
        onClickRemove: () => {
          this.setProps({ isShow: true });
          if (this.children.Popup instanceof Popup) this.children.Popup.setButtonText('Удалить');
          if (this.children.Popup instanceof Block) this.children.Popup.setProps({ formID: 'formPeopleRemove', title: 'Удалить пользователя' });
        },
      }),
      PopupCreate: new Popup({
        title: 'Создание чата',
        buttonText: 'Создать',
        onClickPopup: (e: Event) => {
          if (e.target === e.currentTarget) {
            this.setProps({ isShowCreate: false });
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
            this.updateFormStateCreate(
              (e.target as HTMLInputElement).name as keyof typeof this.props.formStateCreate,
              (e.target as HTMLInputElement).value,
            );
          },
        }),
        onClick: (e: Event) => {
          e.preventDefault();
          chatServices.create(this.props.formStateCreate);
        },
      }),
      Popup: new Popup({
        onClickPopup: (e: Event) => {
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
                if (this.children.Popup instanceof Popup) this.children.Popup.setLabelText('Логин должен содержать от 3 до 20 символов');
              } else if (!loginRegex.test(value)) {
                this.children.Popup.setProps({ textError: 'true' });
                if (this.children.Popup instanceof Popup) this.children.Popup.setLabelText('Логин содержит недопустимые символы');
              } else if (digitsOnly.test(value)) {
                this.children.Popup.setProps({ textError: 'true' });
                if (this.children.Popup instanceof Popup) this.children.Popup.setLabelText('Логин не может состоять только из цифр');
              } else {
                this.children.Popup.setProps({ textError: '' });
                if (this.children.Popup instanceof Popup) this.children.Popup.setLabelText('');
              }
            }
            this.updateFormState(
              (e.target as HTMLInputElement).name as keyof typeof this.props.formState,
              (e.target as HTMLInputElement).value,
            );
          },
        }),
        onClick: (e: Event) => {
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
                chatServices.findAndAdd(this.props.formState, this.props.Activeindex);
              } else {
                chatServices.findAndDelete(this.props.formState, this.props.Activeindex);
              }
            }
            this.setProps({ isShow: false, isContextMenu: false });
          }
        },
      }),

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
            this.setProps({ isShow: false, isContextMenu: false });
            this.ChatSocket.sendMessage({ content: this.props.messageState, type: 'message' });
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

  private async connectWebSocket() {
    try {
      this.ChatSocket.abortHistoryLoad();
      // 1. Закрываем старое соединение
      if (this.ChatSocket.isConnected()) {
        await this.ChatSocket.disconnect();
      }

      // 2. Проверяем данные
      const userId = ((window.store.getState() as StoreState).user as UserDTO).id;
      if (!userId || this.props.Activeindex === -1) {
        return;
      }

      // 3. Подключаемся
      await this.ChatSocket.connect(this.props.Activeindex, userId);

      // 4. Загружаем историю
      await chatServices.get();
    } catch (error) {
    }
  }

  render() {
    const { Activeindex } = this.props;

    if (this.props.members !== undefined) {
      if (
        (
          (window.store.getState() as StoreState).membersTemp.length === 0
          && (this.props.members as MemberListProps[]).length !== 0)
        || arraysDiffer(
          (window.store.getState() as StoreState).membersTemp,
          this.props.members as MemberListProps[],
        )
      ) {
        window.store.set(
          {
            membersTemp: this.props.members,
          },
        );
        if (
          this.props.members !== undefined
          && this.props.members !== null
          && Array.isArray(this.props.members)
        ) {
          this.children.membersComp = this.props.members.map(
            (props2: MemberListProps) => new MemberList({
              ...props2,
              onClick: () => {
                this.setProps({
                  Activeindex: props2.id,
                });
                this.connectWebSocket();
              },
            }),
          );
        }
      }
    }
    const { membersComp } = this.children;
    if (membersComp !== undefined) {
      (membersComp as MemberList[]).forEach((member: MemberList) => {
        if (member.props.id === Activeindex) {
          member.setProps({ check: 'check', className: 'chat__list__member list__member__check' });
        } else {
          member.setProps({ check: '', className: 'chat__list__member' });
        }
      });
    }
    let nameMember: string | undefined = '';
    let photoMember: string | undefined = '';

    if (Activeindex !== -1) {
      // @ts-expect-error Не получается исправить
      let currentMember = this.props.members[0];
      if (membersComp !== undefined) {
        (membersComp as MemberList[]).forEach((member: MemberList) => {
          if (member.props.id === Activeindex) {
            currentMember = member;
          }
        });
      }
      nameMember = currentMember?.props.MemberName;
      photoMember = currentMember?.props.MemberPhoto;
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
                            <img src="${photoMember}" alt="">
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

const mapStateToProps = (state: StoreState) => ({
  members: state.members,
  // Activeindex: state.Activeindex,
});

export default connect(mapStateToProps)(withRouter(ChatPage));

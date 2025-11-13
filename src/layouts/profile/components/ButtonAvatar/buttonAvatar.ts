import { StoreState } from '../../../../api/type';
import Block from '../../../../core/block';
import connect from '../../../../utils/connect';

type ButtonAvatarProps = {
    onClick?: (e: Event) => void;
    pathAvatar?: string;
}

class ButtonAvatar extends Block {
  constructor(props: ButtonAvatarProps) {
    super('button', {
      ...props,
      className: 'button__avatar',
      events: {
        click: props.onClick,
      },
    });
  }

  public render(): string {
    return `
              <img src="{{pathAvatar}}" class="avatar-img">
              <div class="avatar-overlay">
                <p>Поменять<br>аватар</p>
              </div>
        `;
  }
}

const mapStateToProps = (state: StoreState) => ({
  pathAvatar: state.pathAvatar,
});

export default connect(mapStateToProps)(ButtonAvatar);

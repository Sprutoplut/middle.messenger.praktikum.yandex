import Block from '../../../../core/block';
import { connect } from '../../../../utils/connect';

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
            <div class="place__avatar">
            <img src="{{pathAvatar}}">
                <p>Поменять<br>аватар</p>
            </div>
        `;
  }
}

const mapStateToProps = (state) => {
  return {
    pathAvatar: state.pathAvatar,
  };
};

export default connect(mapStateToProps)(ButtonAvatar);
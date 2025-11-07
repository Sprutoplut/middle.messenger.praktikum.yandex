import Block from '../../core/block';
import { connect } from '../../utils/connect';

type LabelErrorProps = {
    textError?: string;
}

class LabelError extends Block {
  constructor(props: LabelErrorProps) {
    super('p', {
      ...props,
      className: 'p__error',
    });
  }

  public render(): string {
    return `
            {{textError}}
        `;
  }
}

const mapStateToProps = (state) => {
  return {
    textError: state.textError,
  };
};

export default connect(mapStateToProps)(LabelError);

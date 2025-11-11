type Props = {
  [key: string]: unknown;
}
// @ts-expect-error Не получается исправить
export default function withRouter(WrappedBlock) {
  return class extends WrappedBlock {
    constructor(props: Props) {
      super({ ...props, router: window.router });
    }
  };
}

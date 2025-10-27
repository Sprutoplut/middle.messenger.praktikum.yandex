import Handlebars from 'handlebars';
import type { HelperOptions } from 'handlebars';
import Block from './block';

interface BlockConstructable<P = Record<string, unknown>> {
  new (props: P): Block;
}

export default function registerComponent<Props extends Record<string, unknown>>(
  Component: BlockConstructable<Props>,
) {
  Handlebars.registerHelper(
    Component.name,
    function componentHelper(
      this: Props,
      { hash: { ref, ...hash }, data, fn }: HelperOptions,
    ) {
      if (!data.root.children) {
        data.root.children = {};
      }

      if (!data.root.refs) {
        data.root.refs = {};
      }

      const { children, refs } = data.root;

      /**
       * Костыль для того, чтобы передавать переменные
       * внутрь блоков вручную подменяя значение
       */
      Object.keys(hash).forEach((key: keyof Props) => {
        if (this[key] && typeof this[key] === 'string') {
          hash[key] = hash[key].replace(
            new RegExp(`{{${String(key)}}}`, 'i'),
            this[key],
          );
        }
      });

      const component = new Component(hash);

      children[component.id] = component;

      if (ref) {
        refs[ref] = component.getContent();
      }

      const contents = fn ? fn(this) : '';

      return `<div data-id="${component.id}">${contents}</div>`;
    },
  );
}

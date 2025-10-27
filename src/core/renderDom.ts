import Block from './block';

export default function renderDOM(block: Block) {
  const root = document.querySelector('#app');

  root!.innerHTML = '';
  root!.appendChild(block.getContent());
}

export function render(query: string, block: Block) {
  const root = document.querySelector(query);

  // Можно завязаться на реализации вашего класса Block
  if (root) root.appendChild(block.getContent());

  block.dispatchComponentDidMount();

  return root;
}

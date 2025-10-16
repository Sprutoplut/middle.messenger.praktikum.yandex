import Handlebars from 'handlebars';
import './chat.less';
import * as ChatComp from './components';
import ChatPage from './chat';

Object.entries(ChatComp).forEach(([name, template]) => {
  if (typeof template === 'function') {
    return;
  }
  Handlebars.registerPartial(name, template);
});

export default ChatPage;

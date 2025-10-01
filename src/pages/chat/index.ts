import Handlebars from "handlebars";
import './chat.less';
import * as ChatComp from './components';

Object.entries(ChatComp).forEach(
    ([name, template]) => {
        Handlebars.registerPartial(name, template);
    }
);

export {default as ChatPage} from './chat.hbs?raw';
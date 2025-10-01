import Handlebars from "handlebars";
import './profile.less';
import * as ProfileComp from './components';

Object.entries(ProfileComp).forEach(
    ([name, template]) => {
        Handlebars.registerPartial(name, template);
    }
);

export {default as ProfileLayout} from './profile.hbs?raw';
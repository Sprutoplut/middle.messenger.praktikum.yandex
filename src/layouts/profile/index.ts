import Handlebars from 'handlebars';
import './profile.less';
import * as ProfileComp from './components';
import ProfileLayout from './profile';

Object.entries(ProfileComp).forEach(([name, template]) => {
  if (typeof template === 'function') {
    return;
  }
  Handlebars.registerPartial(name, template);
});

export default ProfileLayout;

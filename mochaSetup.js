import {JSDOM} from 'jsdom'

const jsdom = new JSDOM(`<body></body>`, {
  url: 'http://localhost/'
});

global.window = jsdom.window;
global.document = jsdom.window.document;
global.location = jsdom.window.location;
global.MouseEvent = jsdom.window.MouseEvent;
global.Node = jsdom.window.Node;
global.XMLHttpRequest = jsdom.window.XMLHttpRequest;

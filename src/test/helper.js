import jsdom from 'jsdom';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

const mockery = require('mockery');
mockery.registerMock('properties', {
  githubClientId: 0,
  githubClientSecret: '',
  redirectUri: 'http://localhost:3003/login',
  dbConnectionString: `postgres://${process.env.BLOOMBURGER_DB_USER}@${process.env.BLOOMBURGER_DB_HOST}:${process.env.BLOOMBURGER_DB_PORT}/bloomburger?connect_timeout=10&application_name=bloomburger`,
});
mockery.enable({warnOnReplace: false, warnOnUnregistered: false});

// Set up testing environment to run like a browser in the command line
// global in node same as window.document
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;

global.window.matchMedia = () => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
});

global.Image = () => true;

const storageMock = () => {
  const storage = {};

  return {
    setItem: (key, value) => {
      storage[key] = value || '';
    },
    getItem: key => {
      return storage[key] || null;
    },
    removeItem: key => {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: i => {
      const keys = Object.keys(storage);
      return keys[i] || null;
    },
  };
};
// mock the localStorage and sessionStorage
global.localStorage = storageMock();
global.sessionStorage = storageMock();

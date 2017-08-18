var jsdom = require('jsdom').jsdom;
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator;

// 注入window上的对象
function propagateToGlobal() {
  for (var key in window) {
    if (!window.hasOwnProperty(key)) continue;
    if (key in global) continue;
    global[key] = window[key];
  }
}
propagateToGlobal();

// 注入自己的全局变量
global.setTimeout = function(callback) {
  callback && callback();
};
global.AlipayJSBridge = {
  call: function(name, opts, callback) {
    // console.log('aa');
    // callback && callback({});
  }
};

// 注入测试依赖
var sinon = require('sinon');
global.sinon = sinon;

var chai = require('chai');
chai.use(require('sinon-chai'));

global.expect = chai.expect;

// 模拟业务上使用
window.luna = {
  config: {
    appId: '88888888',
    appCode: 'demo',
    appName: '我的应用'
  }
};

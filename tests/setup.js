var jsdom = require('jsdom').jsdom;
var documentHtml = '<!doctype html><html><body>' +
  '<div id="barrage"></div>' +
  '</body></html>';
global.document = jsdom(documentHtml);
global.window = document.defaultView;
global.navigator = window.navigator;

// 注入window上的对象
function propagateToGlobal () {
  for (var key in window) {
    if (!window.hasOwnProperty(key)) continue;
    if (key in global) continue;
    global[key] = window[key];
  }
}
propagateToGlobal();

// 注入自己的全局变量
global.setTimeout = function (callback) {
  callback && callback();
};

// 注入测试依赖
var sinon = require('sinon');
global.sinon = sinon;

var chai = require('chai');
chai.use(require('sinon-chai'));

global.expect = chai.expect;

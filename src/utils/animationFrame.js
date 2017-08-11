/**
 * window.requestAnimationFrame polyfill 方法
 */
let lastTime = 0;
const vendors = ['webkit', 'moz'];
let x;
for (x = 0; x < vendors.length && !window.requestAnimationFrame; x += 1) {
  window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`];
  // Webkit中取消方法的名字 是 webkitCancelAnimationFrame
  window.cancelAnimationFrame = window[`${vendors[x]}CancelAnimationFrame`] ||
    window[`${vendors[x]}CancelRequestAnimationFrame`];
}
// 报告环境情况
let animationFrame = '';
switch (x) {
  case 0:
    animationFrame = 'window.requestAnimationFrame';
    break;
  case 1:
    animationFrame = 'window.webkitRequestAnimationFrame';
    break;
  case 2:
    if (window.requestAnimationFrame) {
      animationFrame = 'window.mozRequestAnimationFrame';
    } else {
      animationFrame = 'window.setTimeout';
    }
    break;
  default:
    break;
}
console.log(`当前 requestAnimationFrame 使用：${animationFrame}`);

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function (callback) {
    const currTime = new Date().getTime();
    const timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
    const index = window.setTimeout(() => {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return index;
  };
}
if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function (index) {
    clearTimeout(index);
  };
}
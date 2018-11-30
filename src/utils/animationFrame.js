/**
 * requestAnimationFrame 修正方法。
 * 获取当前浏览器 requestAnimationFrame 的兼容方法，
 * 如果没有，用 setTimeout 代替。
 * @private
 * @returns {string} requestAnimationFrame 名称
 */
function animationFrameClosure () {
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
  // console.log(`当前 requestAnimationFrame 使用：${animationFrame}`);
  // 兼容方式，用 settimeout
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
      const index = window.setTimeout(() => {
        const t = currTime + timeToCall;
        callback(t);
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
  return animationFrame;
}

module.exports = animationFrameClosure();

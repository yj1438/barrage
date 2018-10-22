/**
 * 判断某一 dom 元素是否在视窗范围内
 * @private
 * @param {htmlElement} ele
 * @return {boolean} false: 不在，true: 在，undefined: 无此dom
 */
function isInWindow (ele) {
  if (typeof ele === 'object' && ele.nodeType && ele.nodeType === 1) {
    const clientRect = ele.getBoundingClientRect();
    const winHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (clientRect.bottom < 0 || clientRect.top > winHeight) {
      return false;
    }
    return true;
  }
  return undefined;
}

module.exports = isInWindow;

/**
 * 获取当前浏览器环境的 transitionEvent 事件
 * @return {string} transitionEvent 事件名称
 */
function whichTransitionEndEvent() {
  const el = document.createElement('surface');
  const transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd',
  };

  const keys = Object.keys(transitions);
  let evt = '';
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (el.style[key] !== undefined) {
      evt = transitions[key];
    }
  }
  return evt;
}

module.exports = whichTransitionEndEvent;

// eg: 
// var transitionEvent = whichTransitionEndEvent();
// function evtEndFn () {
//   // ...
//   e.removeEventListener(transitionEvent, evtEndFn, false);
// }
// transitionEvent && e.addEventListener(transitionEvent, evtEndFn);


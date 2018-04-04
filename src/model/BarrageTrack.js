const randomFromRang = require('../utils/randomFromRang');
const transitionendEvent = require('../utils/transitionendEvent');
/**
 * 弹幕跑道
 * @private
 */
const BarrageTrack = function (barrage, i) {
  this.wrapper = barrage.container;
  this.options = barrage.options;
  this.index = i;                       // 弹幕跑道的索引值
  // this.runners = [];                 // 弹幕跑道当前元素（暂不用)
  this.height = barrage.size.height / barrage.options.rowCount;     // 单一跑道的宽度
  // this.top = this._getTop();         // 设定此跑道的位置（Top）
  this.width = barrage.size.width;      // 跑道长度
  this.runningEndTime = new Date().getTime() + (Math.random() * 5 * 1000);   // 跑道空闲时刻
};

/**
 * 获取跑道的的额定 top
 * @private
 * @return {number} 跑道的初步位置(高度)
 */
BarrageTrack.prototype._getTop = function () {
  const positionTop = this.height * (this.index + 1);
  return positionTop;
};

/**
 * 在跑道额定 top 的基础上，进行 top 修正
 * @private
 * @return {number} 跑道的修正位置(高度)
 */
BarrageTrack.prototype._getItemFixTop = function () {
  const options = this.options;
  const top = this._getTop();
  let fixedTop = -(this.height / 2);
  if (options.positionFix) {
    let fix = 0;
    if (Object.prototype.toString.call(options.positionFix) === '[object Array]') {
      fix = randomFromRang(...options.positionFix);
    } else {
      fix = parseFloat(options.positionFix) || 0;
    }
    fixedTop += fix;
  }
  return top + fixedTop;
};

/**
 * 某一弹幕元素起跑
 * @private
 * @param {any} barrageItem 
 */
BarrageTrack.prototype.go = function (barrageItem) {
  const ele = barrageItem.ele;
  const options = this.options;
  // 修正高度
  const fixedTop = this._getItemFixTop();
  ele.style.top = `${fixedTop}px`;
  this.wrapper.container.appendChild(barrageItem.ele);
  setTimeout(() => {
    // 跑道长度
    const width = this.wrapper.size.width;
    // 运动总长度 跑道长度 + 元素自己长度
    const animLong = ele.offsetWidth + width;
    // 运动时长
    const animTime = animLong / options.speed;
    ele.style.transition = `all ${animTime || 0}s linear`;
    ele.style.webkitTransform = `all ${animTime || 0}s linear`;
    // 动画结束后删除自身
    const transitionEvent = transitionendEvent();
    if (transitionEvent) {
      const endEvtFn = function () {
        ele.remove();
        ele.removeEventListener(transitionEvent, endEvtFn, false);  // 销毁事件
      };
      ele.addEventListener(transitionEvent, endEvtFn, false);
    } else {
      // 17 ms 为容错间隔时间
      setTimeout(() => {
        ele.remove();
      }, (animTime * 1000) + 17);
    }
    window.requestAnimationFrame(() => {
      ele.style.webkitTransform = `translate3d(-${width}px,0,0)`;
      ele.style.transform = `translate3d(-${width}px,0,0)`;
    });
    // 此元素独占时间 / 下次跑道空出来的时间：元素运动自身长度 + 间隙最近两元素间隔时间
    const useTime = (ele.offsetWidth / options.speed) + options.intervalTime;
    this.runningEndTime = (new Date().getTime()) + (useTime * 1000);
  }, 17);
};

/**
 * 获取 barrage 配置项
 * @private
 * @return {object} options 配置 
 */
BarrageTrack.prototype.getOptions = function () {
  return this.wrapper.options;
};

module.exports = BarrageTrack;

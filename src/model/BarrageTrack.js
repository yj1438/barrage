import randomFromRang from '../utils/randomFromRang';
/**
 * 弹幕跑道
 */
const BarrageTrack = function (barrage, i) {
  this.wrapper = barrage.container;
  this.options = barrage.options;
  this.index = i;                       // 弹幕跑道的索引值
  // this.runners = [];                 // 弹幕跑道当前元素（暂不用)
  this.height = barrage.size.height / barrage.options.rowCount;     // 单一跑道的宽度
  // this.top = this._getTop();         // 设定此跑道的位置（Top）
  this.width = barrage.size.width;      // 跑道长度
  this.runningTime = new Date().getTime() + (Math.random() * 5 * 1000);   // 跑道空闲时刻
};

BarrageTrack.prototype._getTop = function () {
  const positionTop = this.height * (this.index + 1);
  return positionTop;
};

BarrageTrack.prototype._getItemFixTop = function () {
  const options = this.options;
  const top = this._getTop();
  let fixedTop = -(this.height / 2);
  if (options.positionFix) {
    let fix = 0;
    if (Object.prototype.toString.call(fix) === '[object Array]') {
      fix = randomFromRang(...options.positionFix);
    } else {
      fix = parseFloat(options.positionFix) || 0;
    }
    fixedTop += fix;
  }
  return top + fixedTop;
};

BarrageTrack.prototype.go = function (barrageItem) {
  const ele = barrageItem.ele;
  const options = this.options;
  // 修正高度
  let positionFix = -(this.height / 2);
  if (options.positionFix) {
    let fix = options.positionFix;
    if (typeof fix === 'string') {
      fix = parseFloat(fix);
    }
    if (typeof fix === 'number') {
      positionFix += fix;
    } else if (Object.prototype.toString.call(fix) === '[object Array]') {
      positionFix += randomFromRang(...fix);
    }
  }
  // let positionFix = options.positionFix || -(trackHeight / 2);
  ele.style.top = `${this.top + positionFix}px`;
  this.wrapper.container.appendChild(barrageItem.ele);
  // 跑道长度
  const width = this.wrapper.size.width;
  // 运动总长度 跑道长度 + 元素自己长度
  const animLong = ele.offsetWidth + width;
  // 运动时长
  const animTime = animLong / options.speed;
  ele.style.transition = `all ${animTime || 0}s linear`;
  ele.style.webkitTransform = `all ${animTime || 0}s linear`;
  // 动画结束后删除自身，20 ms 为容错间隔时间
  setTimeout(() => {
    ele.remove();
  }, (animTime * 1000) + 20);
  setTimeout(() => {
    ele.style.transform = `translateX(-${width}px)`;
    ele.style.webkitTransform = `translateX(-${width}px)`;
  }, 16);
  // 此元素独占时间 / 下次跑道空出来的时间：元素运动自身长度 + 间隙最近两元素间隔时间
  const useTime = (ele.offsetWidth / options.speed) + options.intervalTime;
  this.runningTime = (new Date().getTime()) + (useTime * 1000);
};

BarrageTrack.prototype.getOptions = function () {
  return this.wrapper.options;
};

export default BarrageTrack;

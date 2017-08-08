import randomFromRang from '../utils/randomFromRang';
/**
 * 弹幕跑道
 */
const BarrageTrack = function (i) {
  this.index = i;
  this.runners = [];
  this.runningTime = new Date().getTime() + (Math.random() * 5 * 1000);
};

BarrageTrack.prototype.go = function (barrageItem) {
  const ele = barrageItem.ele;
  const options = this.wrapper.options;
  // 设定高度
  const trackHeight = this.wrapper.size.height / options.rowCount;
  const positionTop = trackHeight * (this.index + 1);
  // 修正高度
  let positionFix = -(trackHeight / 2);
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
  ele.style.top = `${positionTop + positionFix}px`;
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
  // 此元素独占时间 / 下次跑道空出来的时间：元素运动自身长度 + 间隙最近两元素间隔时间
  const useTime = (ele.offsetWidth / options.speed) + options.intervalTime;
  this.runningTime = (new Date().getTime()) + (useTime * 1000);
  this.runners.push(barrageItem);
  setTimeout(() => {
    ele.style.transform = `translateX(-${width}px)`;
    ele.style.webkitTransform = `translateX(-${width}px)`;
  }, 16);
};

BarrageTrack.prototype.getOptions = function () {
  return this.wrapper.options;
};

export default BarrageTrack;

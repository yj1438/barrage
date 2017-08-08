import './utils/animationFrame';

import sizeUtil from './utils/size';
import writeStyle from './utils/writeStyle';
import BarrgeTrack from './model/BarrageTrack';
import BarrgeItem from './model/BarrageItem';

const Barrage = function (ele, opt) {
  if (!ele) {
    throw new Error('new Barrage(<string|element>, {}) first parameter is required!');
  }
  let _ele;
  if (typeof ele === 'string') {
    _ele = document.querySelector(ele);
  } else if (typeof ele === 'object' && ele.nodeType && ele.nodeType === 1) {
    _ele = ele;
  }
  if (!_ele) {
    throw new Error('Barrage container is not found!');
  }
  _ele.style.position = 'relative';
  _ele.style.overflow = 'hidden';
  this.container = _ele;
  this.options = Object.assign({}, Barrage.defaultOptions, opt || {});
  this.data = opt.data || [];
  this.size = {
    width: sizeUtil.getWidth(this.container),
    height: sizeUtil.getHeight(this.container),
  };
  // 初始化跑道
  this.tracks = new Array(...new Array(this.options.rowCount))
    .map((item, i) => {
      const barrageItem = new BarrgeTrack(this, i);
      barrageItem.wrapper = this;
      return barrageItem;
    });
};

/**
 * 默认配置
 */
Barrage.defaultOptions = {
  data: [],                   // 初始的数据列表
  isLoop: false,              // 是否循环播放
  rowCount: 4,                // 行数
  intervalTime: 2,            // 最短两弹幕间隔时间
  speed: 150,                 // 移动速度 px/s
  positionFix: 0,             // 位置修正 纵向位置修正
  itemClass: '',              // 弹幕元素 class
  itemMaker: null,            // function 弹幕元素生成器，data 为对象列表时，此项必须 function (item) { this === item }
};

Barrage.writeStyle = writeStyle;

Barrage.prototype.start = function () {
  const options = this.options;
  const animationFrameLoop = () => {
    this.intervalIndex = window.requestAnimationFrame(() => {
      if (this.data && this.data.length > 0) {
        const useTrack = this.getEmptyTrack();
        if (useTrack) {
          const outItem = this.data.splice(0, 1);
          const barrageItem = new BarrgeItem(outItem, options);
          useTrack.go(barrageItem);
          if (this.options.isLoop) {
            this.data.push(outItem);
          }
        }
      }
      animationFrameLoop();
    });
  };
  animationFrameLoop();
};

Barrage.prototype.stop = function () {
  window.cancelAnimationFrame(this.intervalIndex);
};

Barrage.prototype.getEmptyTrack = function () {
  let index;
  let minConsume = 0;
  for (let i = 0; i < this.tracks.length; i += 1) {
    const track = this.tracks[i];
    if (track.runningTime < new Date().getTime()
         && (!minConsume || track.runningTime < minConsume)) {
      minConsume = track.runningTime;
      index = i;
    }
  }
  if (index !== undefined) {
    return this.tracks[index];
  }
  return null;
};

Barrage.prototype.append = function (dataArr) {
  this.data = this.data.concat(dataArr);
};

module.exports = Barrage;

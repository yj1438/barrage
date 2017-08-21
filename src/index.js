require('./utils/animationFrame');
const BarrageTrack = require('./model/BarrageTrack');
const BarrageItem = require('./model/BarrageItem');
const sizeUtil = require('./utils/size');
const writeStyle = require('./utils/writeStyle');
const transitionendEvent = require('./utils/transitionendEvent');
const isInWindow = require('./utils/isInWindow');

/**
 * 弹幕主构造方法
 * @constuctor
 * @param {any} ele 必需项：要绑定的弹幕区域 wrap
 * @param {object} opt 配置参数
 */
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
  this.data = this.options.data || [];
  this.size = {
    width: sizeUtil.getWidth(this.container),
    height: sizeUtil.getHeight(this.container),
  };
  // 初始化跑道
  this.tracks = new Array(...new Array(this.options.rowCount))
    .map((item, i) => {
      const barrageItem = new BarrageTrack(this, i);
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
  refreshfrequency: 'auto',   // 刷新频率
  speed: 150,                 // 移动速度 px/s
  positionFix: 0,             // 位置修正 纵向位置修正
  itemClass: '',              // 弹幕元素 class
  maxDom: 0,                  // 同时允许最多的 dom 元素
  itemMaker: null,            // function 弹幕元素生成器，data 为对象列表时，此项必须 function (item) { this === item }
  onClickItem: function (item) {},
};

/**
 * 获取空闲跑道
 * @private
 * @return {BarrageTrack}
 */
Barrage.prototype._getEmptyTrack = function () {
  let index;
  let minConsume = 0;
  for (let i = 0; i < this.tracks.length; i += 1) {
    const track = this.tracks[i];
    if (track.runningTime < new Date().getTime() &&
         (!minConsume || track.runningTime < minConsume)) {
      minConsume = track.runningTime;
      index = i;
    }
  }
  if (index !== undefined) {
    return this.tracks[index];
  }
  return null;
};

/**
 * 弹幕开始
 * @return {any} 
 */
Barrage.prototype.start = function () {
  if (this.hasStart) {
    return;
  }
  this.hasStart = true;
  const options = this.options;
  const animationFrameLoop = () => {
    this.intervalIndex = window.requestAnimationFrame(() => {
      animationFrameLoop();
      if (options.maxDom) {
        const barrageItems = this.container.querySelectorAll('.barrage-item');
        if (barrageItems && barrageItems.length >= options.maxDom) {
          return;
        }
      }
      if (!isInWindow(this.container)) {
        return;
      }
      if (this.data && this.data.length > 0) {
        const useTrack = this._getEmptyTrack();
        if (useTrack) {
          const outItem = this.data.splice(0, 1)[0];
          const barrageItem = new BarrageItem(outItem, options);
          useTrack.go(barrageItem);
          if (this.options.isLoop) {
            this.data.push(outItem);
          }
        }
      }
    });
  };
  animationFrameLoop();
};

/**
 * 弹幕停止
 */
Barrage.prototype.stop = function () {
  window.cancelAnimationFrame(this.intervalIndex);
  this.hasStart = false;
};

/**
 * 批量追加数据
 * @param {array} dataArr 需要追加的弹幕元素列表
 */
Barrage.prototype.append = function (dataArr) {
  this.data = this.data.concat(dataArr);
};

/**
 * 实时发布
 * @param {any} data 
 */
Barrage.prototype.publish = function (data) {
  this.data = [data, ...this.data];
};

/**
 * 添加静态方法
 */
// 写本地内联样式
Barrage.writeStyle = writeStyle;
// 判断当前环境 animationEvent
Barrage.transitionendEvent = transitionendEvent;

module.exports = Barrage;

require('./utils/animationFrame');
const BarrageTrack = require('./model/BarrageTrack');
const BarrageItem = require('./model/BarrageItem');
const sizeUtil = require('./utils/size');
const transitionendEvent = require('./utils/transitionendEvent');
const isInWindow = require('./utils/isInWindow');
const numberPool = require('./utils/numberPool');

/**
 * 弹幕主构造方法
 * @param {string|elementNode} ele 必需项：要绑定的弹幕区域 wrap
 * @param {object} opt 配置参数，详见使用文档
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
  // 弹幕元素是绝对定位，需要给容器添加 position
  const style = window.getComputedStyle(_ele);
  if (style.position !== 'relative' && style.position !== 'absolute' && style.position !== 'fixed') {
    _ele.style.position = 'relative';
  }
  _ele.style.overflow = 'hidden';
  this.container = _ele;
  this.options = Object.assign({}, Barrage.defaultOptions, opt || {});
  this.data = this.options.data || [];
  this.size = {
    width: sizeUtil.getWidth(this.container),
    height: sizeUtil.getHeight(this.container),
  };
  // 给每个跑道定义一个随机的开始值
  numberPool.init(this.options.rowCount);
  // 初始化跑道
  this.tracks = new Array(...new Array(this.options.rowCount))
    .map((item, i) => {
      const barrageItem = new BarrageTrack(this, i, numberPool.get());
      barrageItem.wrapper = this;
      return barrageItem;
    });
  // 初始化状态 1：进行中；0：人工停止；-1：非人工停止(如：页面压入后台)
  this.hasStart = -1;
  this._bindEvent();
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
  onClickItem: function (evt, item) {},
  onDataEmpty: function () {},
  onAllTrackEmpty: function () {},
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
    if (track.runningEndTime < new Date().getTime() &&
         (!minConsume || track.runningEndTime < minConsume)) {
      minConsume = track.runningEndTime;
      index = i;
    }
  }
  if (index !== undefined) {
    return this.tracks[index];
  }
  return null;
};

/**
 * 判断所有跑道都空了
 */
Barrage.prototype._isAllTrackEmpty = function () {
  return this.tracks.every(track => track.emptyTime < new Date().getTime());
};

/**
 * 绑定事件
 * 用于在手机钱包 app 中，页面压入后台时停止跑弹幕
 * @private
 */
Barrage.prototype._bindEvent = function () {
  // ant bridge 页面压入后台时停止跑弹幕
  document.addEventListener('pause', (e) => {
    if (this.hasStart === 1) {
      this.stop();
    }
  }, false);
  // 页面恢复运行时开始跑弹幕
  document.addEventListener('resume', (e) => {
    if (this.hasStart === -1) {
      this.start();
    }
  }, false);
};

/**
 * 弹幕开始
 */
Barrage.prototype.start = function () {
  if (this.hasStart === 1) {
    return;
  }
  this.hasStart = 1;
  const options = this.options;
  const animationFrameLoop = () => {
    this.intervalIndex = window.requestAnimationFrame(() => {
      // 定义1s的交错时间
      this.nextTimeoutIndex = window.setTimeout(() => {
        animationFrameLoop();
      }, 16 * 2);
      let canRun = true;
      if (options.maxDom) {
        const barrageItems = this.container.querySelectorAll('.barrage-item');
        if (barrageItems && barrageItems.length >= options.maxDom) {
          canRun = false;
        }
      }
      if (!isInWindow(this.container)) {
        canRun = false;
      }
      const useTrack = this._getEmptyTrack();
      if (!useTrack) {
        canRun = false;
      }
      if (canRun) {
        if (this.data.length > 0) {
          const outItem = this.data.splice(0, 1)[0];
          const barrageItem = new BarrageItem(outItem, options);
          useTrack.go(barrageItem);
          if (this.options.isLoop) {
            this.data.push(outItem);
          }
        } else {
          this.options.onDataEmpty();
          if (this._isAllTrackEmpty()) {
            this.options.onAllTrackEmpty();
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
Barrage.prototype.stop = function (isForPause) {
  window.cancelAnimationFrame(this.intervalIndex);
  window.clearTimeout(this.nextTimeoutIndex);
  this.hasStart = isForPause ? -1 : 0;
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
 * 判断当前环境 animationEvent
 * @static
 */
Barrage.transitionendEvent = transitionendEvent;

module.exports = Barrage;

import sizeUtil from './utils/size';

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
  this.container = _ele;
  this.options = Object.assign({}, Barrage.defaultOptions, opt || {})
  this.data = opt.data || [];
  this.size = {
    width: sizeUtil.getWidth(this.container),
    height: sizeUtil.getHeight(this.container),
  };
  // 初始化跑道
  this.tracks = Array.apply(null, Array(this.options.rowCount)).map(function(item, i) {
      return new BarrgeTrack(i);
  });
};

Barrage.defaultOptions = {
  data: [],
  rowCount: 4,
};

Barrage.prototype.start = function () {
  this.timeoutIndex = window.setInterval(() => {
    if (this.data && this.data.length > 0) {
      const outItem = this.data.splice(0, 1);
      const useTrack = this.getEmptyTrack();
      console.log(useTrack);
    }
  }, 1000);
}

Barrage.prototype.end = function () {
  this.timeoutIndex && window.clearInterval(this.timeoutIndex);
}

Barrage.prototype.getEmptyTrack = function () {
  let index;
  let minConsume = 0;
  for (let i = 0; i < this.tracks.length; i++) {
    const track = this.tracks[i];
    if (minConsume < track.runningTime) {
      minConsume = track.runningTime;
      index = i;
    }
  }
  return {
    index,
    minConsume,
  }
}

module.exports = Barrage;

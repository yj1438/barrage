/**
 * 弹幕跑道
 */
const BarrageTrack = function (i) {
  this.index = i;
  this.runner = [];
  this.runningTime = new Date().getTime();
}

BarrageTrack.prototype.go() {
  
}

export default BarrageTrack;
const BarrageItem = function (text) {
  this.ele = this.createElement(text);
};

BarrageItem.prototype.createElement = function (text) {
  const ele = document.createElement('span');
  ele.innerText = text;
  ele.id = `barrage_item_${new Date().getTime()}`;
  ele.style.position = 'absolute';
  return ele;
};

export default BarrageItem;
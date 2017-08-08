/**
 * 弹幕元素对象
 * @param {any} data 元素数据，简单情况下是字符串 
 * @param {object} options 相关配置
 *        itemClass: 元素对象的自定义 class
 *        itemMaker: 元素dom的睡在定义生成器
 */
const BarrageItem = function (text, options) {
  this.options = options;
  this.ele = this.createElement(text);
};

BarrageItem.prototype.createElement = function (text) {
  const ele = document.createElement('div');
  ele.classList.add('barrage-item');
  if (this.options.itemClass) {
    ele.classList.add(this.options.itemClass);
  }
  if (this.options.itemMaker) {
    ele.innerHTML = this.options.itemMaker.bind(text)(text);
  } else {
    ele.innerText = text;
  }
  ele.id = `barrage_item_${new Date().getTime()}`;
  ele.style.position = 'absolute';
  ele.style.right = 0;
  ele.style.whiteSpace = 'nowrap';
  ele.style.transform = 'translateX(100%)';
  ele.style.webkitTransform = 'translateX(100%)';
  return ele;
};

BarrageItem.prototype.remove = function () {
  this.ele.parentElement.removeChild(this.ele);
};

export default BarrageItem;

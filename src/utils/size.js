function getWidth(ele) {
  return ele && ele.offsetWidth;
}
function getHeight(ele) {
  return ele && ele.offsetHeight;
}

/**
 * 获取dom元素 width height 方法
 * @param {any} ele 
 * @returns 
 */
export default {
  getWidth,
  getHeight,
};

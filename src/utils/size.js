function getWidth(ele) {
  return ele && ele.offsetWidth;
}

function getHeight(ele) {
  return ele && ele.offsetHeight;
}

module.exports = {
  getWidth,
  getHeight,
};

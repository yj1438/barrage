/**
 * 向页面 style 元素中写入内联样式
 * @param {any} cssString 需要写入的样式字符串，eg：'body{margin-top: 20px}'
 */
function writeStyle (cssString) {
  const styleEleId = 'barrage_style';
  let styleEle = document.querySelector(styleEleId);
  if (!styleEle) {
    styleEle = document.createElement('style');
    styleEle.id = styleEleId;
    document.getElementsByTagName('head')[0].appendChild(styleEle);
  }
  const styleSheet = styleEle.sheet;
  styleSheet.insertRule(cssString);
}

module.exports = writeStyle;

// eg:
// writeStyle('body{margin-top: 20px}')

/**
 * 向页面 style 元素中写入内联样式
 * @export
 * @param {any} cssString 
 */
export default function (cssString) {
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

/**
 * 在一范围内取一随机数
 * @export
 * @param {float} from 范围起始值
 * @param {float} to 范围终止值
 * @return {float} 随机得出的数值
 */
function randomFromRange (from, to) {
  const _from = parseFloat(from);
  const _to = parseFloat(to);
  if (!_from || !_to) {
    return 0;
  }
  return _from + ((_to - _from) * Math.random());
}

module.exports = randomFromRange;

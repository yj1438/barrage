/**
 * 在一范围内取一随机数
 * @export
 * @param {any} from 范围起始值
 * @param {any} to 范围终止值
 * @returns 
 */
export default function (from, to) {
  const _from = parseFloat(from);
  const _to = parseFloat(to);
  if (!_from || !_to) {
    return 0;
  }
  return _from + ((_to - _from) * Math.random());
}

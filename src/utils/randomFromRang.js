export default function (from, to) {
  const _from = parseFloat(from);
  const _to = parseFloat(to);
  if (!_from || !_to) {
    return 0;
  }
  return _from + ((_to - _from) * Math.random());
}

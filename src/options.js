/**
 * default 配置
 */
const options = {
  data: [],
  rowCount: 4,
  intervalTime: 2,
  speed: 150,
};

export default {
  getOptions: () => options,
  setOptions: (o) => {
    if (Object.prototype.toString.call(o) === '[object Object]') {
      Object.assign(options, o);
    }
  },
};

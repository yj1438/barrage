console.log('welcome to barrage example~');

import Barrage from '../src/index';

const data = [];

let i = 36;
while(i > 0) {
  data.push(Math.random().toString(16));
  --i;
}
const barrage = new Barrage('#barrage', {
  data: data,         // 需要弹出的数据
  rowCount: 4,        // 行数
  loop: false,        // 是否需要
});

console.log(barrage);

barrage.start();



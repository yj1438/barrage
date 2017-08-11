import Barrage from '../src/index';

console.warn('welcome to barrage example~');

function makeTestData(count, char) {
  let i = count;
  const data = [];
  while (i > 0) {
    // 随机长度
    let randomSize = Math.ceil(Math.random() * 50);
    let str = char;
    while (randomSize > 0) {
      str += char;
      randomSize -= 1;
    }
    data.push(str);
    i -= 1;
  }
  return data;
}

/*
  data: [],                   // 初始的数据列表
  isLoop: false,              // 是否循环播放
  rowCount: 4,                // 行数
  intervalTime: 2,            // 最短两弹幕间隔时间
  speed: 150,                 // 移动速度 px/s
  positionFix: 0,             // 位置修正 纵向位置修正
  itemClass: '',              // 弹幕元素 class
  itemMaker: null,            // function 弹幕元素生成器，data 为对象列表时，此项必须 function (item) { this === item }
*/
const barrage = new Barrage('#barrage', {
  data: makeTestData(20, '😂'),
  isLoop: true,
  rowCount: 20,
  intervalTime: 1,
  speed: 200,       // 建议不要超过200
  // positionFix: [-30, 10],
  itemClass: 'my-barrage',
  maxDom: 0,
  itemMaker(itemData) {
    return `用户：${itemData}`;
  },
});

barrage.start();

setTimeout(() => {
  barrage.append(makeTestData(10, '😱'));
  // barrage.stop();
}, 15000);

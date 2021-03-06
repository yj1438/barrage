

# barrage

> 弹幕组件

## 查看 demo

```js
$ npm i
$ npm run dev
```

`http://0.0.0.0:8080/demo/`

## 特点

* 无任何依赖
* 高度自定义，适用于各种业务场景
* 性能良好
  - absolute 定位后在页面渲染后只绘制一次，不会回流
  - 基于 css3 动画
  - 优先使用 requestAnimationFrame 和 transitionEvent，自动降级，保证浏览器最好状态的性能支持
  - 可控制显示的元素最大数量，弹幕元素离开屏幕可视区后自动销毁
  - 弹幕区域不在屏幕可视区内、页面未激活时，会自行停止跑弹幕

## 引用方法

> 目前还未发布到 npm，只能手动取代码，或引用 `dist/index.js` 文件

## 使用方法

#### 1、最简单使用

```html
<div id="barrage" style="height: 300px"></div>
```

```js
var barrage = new Barrage('#barrage');
// 开启
barrage.start();
```

更多用法请见 [/demo/simple/index.html]

#### 2、综合使用

```html
<style>
#barrage {
  height: 300px;
  background: #eee;
  background-image: url(https://gw.alipayobjects.com/zos/rmsportal/ciHRWZzemAopFLkjWNXY.jpg);
  background-size: cover;
}
/* itemmaker 自定义样式 */
.my-barrage-item {
  padding: 2px;
  background-color: rgba(255,255,255,.5);
  border: 1px solid #eee;
  border-radius: 6px;
  line-height: 1.2;
  font-size: 12px;
  cursor: pointer;
}
.my-barrage-item.self {
  font-size: 16px;
  margin-top: -2px;
  color: red;
}
.my-barrage-item .item-user {
  display: inline-block;
  padding: 2px;
  border: 1px solid #aaa;
  background-color: rgba(255,255,255,.8);
  border-radius: 6px;
}
</style>
<div id="barrage"></div>
```

```javascript
/**
 * 综合使用方法
 */
var barrage = new Barrage('#barrage', {
  data: [{type: 1, user: '小张', text: '这是一条弹幕'}, {type: 1, user: '小张', text: '这是另外一条弹幕'}],                 // 初始化数据
  isLoop: true,                                 // 循环滚动
  rowCount: 5,                                  // 弹幕元素行数
  intervalTime: 1,                              // 最短两个弹幕间隔时间(s)
  speed: 200,                                   // 弹幕行进速度 px/s
  positionFix: -12,                             // 弹幕位置(高度)修正
  itemClass: 'my-barrage',                      // 弹幕元素 class
  maxDom: 0,                                    // 最多同时显示的弹幕数
  itemMaker: function (itemData) {              // 弹幕元素自定义生成方法
    var html = '<div class="my-barrage-item ' + (itemData.type === 0 ? 'self' : '') + '" >'
      + '<span class="item-user">' + itemData.user + '</span>'
      + '<span class="item-type-' + itemData.type + '">' + itemData.text + '</span>'
      + '</div>'
    return html;
  },
  onClickItem: function (evt, item) {           // 点击弹幕元素事件
    item.remove();                              // item 为弹幕元素封装对象
  }
});
// 开启
barrage.start();
// 添加一批弹幕，一般用于后台推送滚动的弹幕信息
barrage.append([{type: 1, user: '小张', text: '这是一条弹幕'}, {type: 1, user: '小张', text: '这是一条弹幕'}]);
// 即时发布一条弹幕，一般用于当前用户发出显示的弹幕
barrage.publish({type: 0, user: '我自己', text: '这是我的弹幕'});
```

详情请见 [/demo/advance/index.html]

### 参数

`new Barrage(ele, options)`

* ele: **必填**，弹幕容器，支持两种形式，1) 选择符，如 `#barrage`；2) dom 对象，如可以直接传入 `document.getElementById('#barrage')`；
* options: **选填**，见下详情。

### options 配置

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| data | array:any | [] | 弹幕数据初始化列表，在 `start` 后，会自动从中一一取出进行播放，data 数组中的元素值会做为参数传入 `itemMaker` |
| isLoop | boolean | false | 是否循环播放 |
| rowCount | number | 4 | 弹幕元素行数，根据自己的区域大小，自行调整 |
| intervalTime | number / array:[min, max] | 2 | `number`: 前后两个弹幕最短间隔时间(s)；<br/>`[min, max]`，eg：`[0.5, 2]`，在这个范围内取随机值。 |
| speed | number | 150 | 弹幕行进速度(px/s)，建议不要超过200 |
| positionFix | number / array:[min, max] | 0 | 弹幕位置(高度)修正，根据实际情况进行调整。<br/>`number` 可以为负值，相当于弹幕元素 dom 的 `margin-top`。<br/>`[min, max]`，eg：`[-20, 10]`，在这个范围内取随机值。<br/>你想要参差不齐的弹幕，就设置 `[min, max]` 吧 |
| itemClass | string | '' | 自定义弹幕元素 dom class |
| maxDom | number | 0 | 最多同时显示的弹幕数<br/>`0`为不限制 |
| itemMaker | function (itemData) |  | 自定义弹幕元素的生成方法，`itemData` 为弹幕元素数据。如果不设置默认会将 itemData.toString，参照 [/demo/advance/index.html]|
| onClickItem | function (evt, item) |  | 点击弹幕元素事件<br/>`evt`：事件对象，<br/>`item`：封装的元素对象，见 `BarrageItem` 方法<br/>`item.ele`：元素 dom<br/>`remove`：销毁自己 |
| onDataEmpty | function () |  | 当前弹幕 data 无数据时触发，仅在 `isLoop: false` 时有效 |
| onAllTrackEmpty | function () |  | 所有弹幕 dom 都滚动结束后触发，仅在 `isLoop: false` 时有效 |

> 注意：弹幕组件 start 状态下会一直监听 data，即使为空也行，所以 `onDataEmpty` 和 `onAllTrackEmpty` 回调会不断触发。

### 方法

#### Barrage

* `start`：开始滚动弹幕
* `stop`：停止滚动弹幕，已经出现的弹幕不会立即消失，只是不再有新的弹幕进来
* `append`：追加一批需要播放的数据
* `publish`：立即发布一条新的弹幕

### 静态方法

* `transitionendEvent`：获取当前环境的 transitionend 事件名称，eg: `Barrage.transitionendEvent()`

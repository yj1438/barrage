<style>
table {
	border-collapse: collapse;
	border-spacing: 0;
	empty-cells: show;
	border: 1px solid #e9e9e9;
	width: 100%;
	margin: 8px 0 16px
}

table th {
	white-space: nowrap;
	color: #5c6b77;
	font-weight: 600
}

table td,table th {
	border: 1px solid #e9e9e9;
	padding: 8px 16px;
	text-align: left
}

table th {
	background: #f7f7f7
}
</style>

# luna-barrage

> 弹幕组件

## 查看 demo

![](https://zos.alipayobjects.com/rmsportal/PrervxyTsoutjmu.jpg)

![](https://gw.alipayobjects.com/zos/rmsportal/vEsoigqOGrYWrrPvZLDF.gif)

[http://site.alipay.net/luna-component/luna-barrage/demo/index.html](http://site.alipay.net/luna-component/luna-barrage/demo/index.html)

## 引用方法

### 方法 1

作为依赖引用，这也是推荐的做法

``` bash
tnpm install @alipay/luna-barrage --save
```

然后在 js 中调用
``` js
var Barrage = require('@alipay/luna-barrage');
```

### 方法 2

也可以直接引用线上 cdn 地址（版本号 x.x.x 见[TAGS](http://gitlab.alipay-inc.com/luna-component/luna-barrage/tags)）：

* 压缩版：https://as.alipayobjects.com/g/luna-component/luna-barrage/x.x.x/index.js
* 未压缩版，线上不要使用：https://as.alipayobjects.com/g/luna-component/luna-barrage/x.x.x/index.debug.js

然后通过 `luna.Barrage` 来调用

## 特点

* 高度自定义性，适用于各种业务场景
* 性能优，从多方面保证性能优先
  - 基于 css3 动画，absolute 定位后在页面渲染后只绘制一次，不会回流
  - 优先使用 requestAnimationFrame 和 transitionEvent，自动降级，保证浏览器最好状态的性能支持
  - 支持限制显示的元素最大数据，弹幕元素跑过后会立即销毁
  - 弹幕区域不在显示视窗内、页面未激活时，会自行停止跑弹幕

## 使用方法

#### 1、最简单使用

```html
<div id="barrage" style="height: 30vh"></div>
```

```js
var barrage = new window.luna.Barrage('#barrage');
// 开启
barrage.start();
```

更多用法请见 [demo](http://gitlab.alipay-inc.com/luna-component/luna-barrage/tree/master/demo/simple/index.html)

#### 2、综合使用

```html
<style>
#barrage {
  height: 40vh;
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
var barrage = new window.luna.Barrage('#barrage', {
  data: makeTestData(20, '😂'),                 // 初始化数据
  isLoop: true,                                 // 循环滚动
  rowCount: 5,                                  // 弹幕元素行数
  intervalTime: 1,                              // 最短两个弹幕间隔时间(s)
  speed: 200,                                   // 弹幕行进速度
  positionFix: -12,                             // 弹幕位置(高度)修正
  itemClass: 'my-barrage',                      // 自定义元素 dom class
  maxDom: 0,                                    // 最多同时显示的弹幕数
  itemMaker: function (itemData) {              // 弹幕元素自定义生成方法
    var html = '<div class="my-barrage-item ' + (itemData.type === 0 ? 'self' : '') + '" >'
      + '<span class="item-user">' + itemData.user + '</span>'
      + '<span class="item-type-' + itemData.type + '">' + itemData.text + '</span>'
      + '</div>'
    return html;
  },
  onClickItem: function (evt) {                 // 点击弹幕元素事件
    this.remove();                              // this 为弹幕元素封装对象
  }
});
// 开启
barrage.start();
// 添加一批弹幕，一般用于后台推送滚动的弹幕信息
barrage.append([{type: 1, user: '小张', text: '这是一条弹幕'}, {type: 1, user: '小张', text: '这是一条弹幕'}]);
// 即时发布一条弹幕，一般用于当前用户发出显示的弹幕
barrage.publish({type: 0, user: '我自己', text: '这是我的弹幕'});
```
代码示例少相关依赖方法，详情请见 [demo](http://gitlab.alipay-inc.com/luna-component/luna-barrage/tree/master/demo/advance/index.html)

### 配置

| 参数 | 类型 | 默认值 | 说明 |
| -- | -- | -- | -- |
| data | array:any | [] | 弹幕数据初始化列表，在 `start` 后，会自动从中一一取出进行播放 |
| isLoop | boolean | false | 是否循环播放 |
| rowCount | number | 4 | 弹幕元素行数，根据自己的区域大小，自行调整 |
| intervalTime | nubmer | 2 | 前后两个弹幕最短间隔时间(s) |
| speed | nubmer | 150 | 弹幕行进速度(px/s)，建议不要超过200 |
| positionFix | nubmer / array:[min, max] | 0 | 弹幕位置(高度)修正，根据实际情况进行调整。<br/>`number` 可以为负值，相当于弹幕元素 dom 的 `margin-top`。<br/>`[min, max]`，eg：`[-20, 10]`，在这个范围内取随机值。<br/>你想要参差不齐的弹幕，就设置 `[min, max]` 吧 |
| itemClass | string | '' | 自定义弹幕元素 dom class |
| maxDom | number | 0 | 最多同时显示的弹幕数 |
| itemMaker | function (itemData) |  | 自定义弹幕元素的生成方法，`itemData` 为弹幕元素数据。如果不设置默认会将 itemData.toString，参照 [综合用法](http://gitlab.alipay-inc.com/luna-component/luna-barrage/tree/master/demo/advance/index.html) |
| onClickItem | function (evt) |  | 点击弹幕元素事件<br/>`ent` 为事件对象，<br/>`this`：封装的元素对象，见 `BarrageItem` 方法，`this.ele`：元素 dom |

### 方法

#### Barrage

* `start`：开始滚动弹幕
* `stop`：停止滚动弹幕，已经出现的弹幕不会立即消失，只是不再有新的弹幕进来
* `append`：追加一批需要播放的数据
* `publish`：立即发布一条新的弹幕

#### BarrageItem

* `remove`：销毁自己

### 静态方法

* `transitionendEvent`：获取当前环境的 transitionend 事件名称，eg: `luna.Barrage.transitionendEvent()`

## API文档

[http://site.alipay.net/luna-component/luna-barrage/docs/index.html](http://site.alipay.net/luna-component/luna-barrage/docs/index.html)

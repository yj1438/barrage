# barrage

h5 弹幕插件，满足常见弹幕的需求，功能全面。

## Demo

```bash
$ git clone https://github.com/yj1438/barrage.git
$ cd barrage
$ npm i
$ npm run example
```

open `http://0.0.0.0:9080`

## Installation

(还未发到 npm)

## Features

* 原生 js 编写，无依赖，使用简单
* 高自定义性，可适用多种环境
* 性能好，从多方面保证性能优先
* 支持 umd 引用

## Usage

```html
<script scr='barrage.js'></script>
<style>
#barrage {
  height: 300px;
  background: #eee;
}
</style>
<div id="barrage"></div>
```

```javascript
const barrage = new Barrage('#barrage', {
  data: ['我的弹幕😂', '我的弹幕😂', '我的弹幕😂', '我的弹幕😂', '我的弹幕😂'],
  isLoop: true,
  rowCount: 20,
  intervalTime: 1,
  speed: 200,       // 建议不要超过200
  positionFix: [-30, 10],
  itemClass: 'my-barrage',
  maxDom: 0,
  itemMaker(itemData) {
    return `用户：${itemData}`;
  },
});

barrage.start();
```
## Todo

* to React/Vue Component
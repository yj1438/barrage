# luna-barrage

> 弹幕组件

## 查看 demo

![](https://zos.alipayobjects.com/rmsportal/PrervxyTsoutjmu.jpg)

[http://site.alipay.net/luna-component/luna-barrage/demo/index.html](http://site.alipay.net/luna-component/luna-barrage/demo/index.html)

## 引用方法

### 方法 1

作为依赖引用，这也是推荐的做法

``` bash
tnpm install @alipay/luna-barrage --save
```

然后在 js 中调用
``` js
var barrage = require('@alipay/luna-barrage');
```

### 方法 2

也可以直接引用线上 cdn 地址（版本号 x.x.x 见[TAGS](http://gitlab.alipay-inc.com/luna-component/luna-barrage/tags)）：

* 压缩版：https://as.alipayobjects.com/g/luna-component/luna-barrage/x.x.x/index.js
* 未压缩版，线上不要使用：https://as.alipayobjects.com/g/luna-component/luna-barrage/x.x.x/index.debug.js

然后通过 `luna.barrage` 来调用

## 特点

* 无任何依赖，方便使用，兼容任一支持 CSS transition 浏览器
* 高度自定义性，适用于各种业务场景
* 性能优，从多方面保证性能优先
  - 弹幕元素 css3 动画，absolute 定位后在页面渲染后只绘制一次，不会回流
  - 优先使用 requestAnimationFrame 和 transitionEvent，保证浏览器最好状态的性能支持
  - 支持限制显示的元素最大数据，弹幕元素跑过后会立即销毁
  - 弹幕区域不在显示视窗内、页面未激活时，会自行停止跑弹幕

## 使用方法

#### 1、最简单的例子

```html
<div id="barrage" style="height: 30vh"></div>
```

``` js
var barrage = new window.luna.barrage('#barrage');
// 开启
barrage.start();
```

更多用法请见 [demo](http://gitlab.alipay-inc.com/luna-component/luna-barrage/tree/master/demo/index.html)

#### 2、综合使用



## API文档

[http://site.alipay.net/luna-component/luna-barrage/docs/index.html](http://site.alipay.net/luna-component/luna-barrage/docs/index.html)

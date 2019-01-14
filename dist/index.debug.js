/*!
 * barrage - 弹幕组件
 * Author: yj1438
 * Version: v0.1.9
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Barrage"] = factory();
	else
		root["luna"] = root["luna"] || {}, root["luna"]["Barrage"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	__webpack_require__(2);
	var BarrageTrack = __webpack_require__(3);
	var BarrageItem = __webpack_require__(6);
	var sizeUtil = __webpack_require__(7);
	var transitionendEvent = __webpack_require__(5);
	var isInWindow = __webpack_require__(8);
	var numberPool = __webpack_require__(9);

	/**
	 * 弹幕主构造方法
	 * @param {string|elementNode} ele 必需项：要绑定的弹幕区域 wrap
	 * @param {object} opt 配置参数，详见使用文档
	 */
	var Barrage = function Barrage(ele, opt) {
	  var _this = this;

	  if (!ele) {
	    throw new Error('new Barrage(<string|element>, {}) first parameter is required!');
	  }
	  var _ele = void 0;
	  if (typeof ele === 'string') {
	    _ele = document.querySelector(ele);
	  } else if ((typeof ele === 'undefined' ? 'undefined' : _typeof(ele)) === 'object' && ele.nodeType && ele.nodeType === 1) {
	    _ele = ele;
	  }
	  if (!_ele) {
	    throw new Error('Barrage container is not found!');
	  }
	  // 弹幕元素是绝对定位，需要给容器添加 position
	  var style = window.getComputedStyle(_ele);
	  if (style.position !== 'relative' && style.position !== 'absolute' && style.position !== 'fixed') {
	    _ele.style.position = 'relative';
	  }
	  _ele.style.overflow = 'hidden';
	  this.container = _ele;
	  this.options = _extends({}, Barrage.defaultOptions, opt || {});
	  this.data = this.options.data || [];
	  this.size = {
	    width: sizeUtil.getWidth(this.container),
	    height: sizeUtil.getHeight(this.container)
	  };
	  // 给每个跑道定义一个随机的开始值
	  numberPool.init(this.options.rowCount);
	  // 初始化跑道
	  var initArr = [];
	  var n = this.options.rowCount;
	  while (n--) {
	    initArr[n] = 0;
	  }this.tracks = initArr.map(function (item, i) {
	    var barrageTrack = new BarrageTrack(_this, i, numberPool.get());
	    barrageTrack.wrapper = _this;
	    return barrageTrack;
	  });
	  // 初始化状态 1：进行中；0：人工停止；-1：非人工停止(如：页面压入后台)
	  this.hasStart = 0;
	  this._bindEvent();
	};

	/**
	 * 默认配置
	 */
	Barrage.defaultOptions = {
	  data: [], // 初始的数据列表
	  isLoop: false, // 是否循环播放
	  rowCount: 4, // 行数
	  intervalTime: 2, // 最短两弹幕间隔时间
	  refreshfrequency: 'auto', // 刷新频率
	  speed: 150, // 移动速度 px/s
	  positionFix: 0, // 位置修正 纵向位置修正
	  itemClass: '', // 弹幕元素 class
	  maxDom: 0, // 同时允许最多的 dom 元素
	  itemMaker: null, // function 弹幕元素生成器，data 为对象列表时，此项必须 function (item) { this === item }
	  onClickItem: function onClickItem(evt, item) {},
	  onDataEmpty: function onDataEmpty() {},
	  onAllTrackEmpty: function onAllTrackEmpty() {}
	};

	/**
	 * 获取空闲跑道
	 * @private
	 * @return {BarrageTrack}
	 */
	Barrage.prototype._getEmptyTrack = function () {
	  var index = void 0;
	  var minConsume = 0;
	  for (var i = 0; i < this.tracks.length; i += 1) {
	    var track = this.tracks[i];
	    if (track.runningEndTime < new Date().getTime() && (!minConsume || track.runningEndTime < minConsume)) {
	      minConsume = track.runningEndTime;
	      index = i;
	    }
	  }
	  if (index !== undefined) {
	    return this.tracks[index];
	  }
	  return null;
	};

	/**
	 * 判断所有跑道都空了
	 */
	Barrage.prototype._isAllTrackEmpty = function () {
	  return this.tracks.every(function (track) {
	    return track.emptyTime < new Date().getTime();
	  });
	};

	/**
	 * 绑定事件
	 * 用于在手机钱包 app 中，页面压入后台时停止跑弹幕
	 * @private
	 */
	Barrage.prototype._bindEvent = function () {
	  var _this2 = this;

	  // ant bridge 页面压入后台时停止跑弹幕
	  document.addEventListener('pause', function (e) {
	    if (_this2.hasStart === 1) {
	      _this2.stop(true);
	    }
	  }, false);
	  // 页面恢复运行时开始跑弹幕
	  document.addEventListener('resume', function (e) {
	    if (_this2.hasStart === -1) {
	      _this2.start();
	    }
	  }, false);
	};

	/**
	 * 弹幕开始
	 */
	Barrage.prototype.start = function () {
	  var _this3 = this;

	  if (this.hasStart === 1) {
	    return;
	  }
	  this.hasStart = 1;
	  var options = this.options;
	  var animationFrameLoop = function animationFrameLoop() {
	    _this3.intervalIndex = window.requestAnimationFrame(function () {
	      // 定义1s的交错时间
	      _this3.nextTimeoutIndex = window.setTimeout(function () {
	        animationFrameLoop();
	      }, 16 * 2);
	      var canRun = true;
	      if (options.maxDom) {
	        var barrageItems = _this3.container.querySelectorAll('.barrage-item');
	        if (barrageItems && barrageItems.length >= options.maxDom) {
	          canRun = false;
	        }
	      }
	      if (!isInWindow(_this3.container)) {
	        canRun = false;
	      }
	      var useTrack = _this3._getEmptyTrack();
	      if (!useTrack) {
	        canRun = false;
	      }
	      if (canRun) {
	        if (_this3.data.length > 0) {
	          var outItem = _this3.data.splice(0, 1)[0];
	          var barrageItem = new BarrageItem(outItem, options);
	          useTrack.go(barrageItem);
	          if (_this3.options.isLoop) {
	            _this3.data.push(outItem);
	          }
	        } else {
	          _this3.options.onDataEmpty();
	          if (_this3._isAllTrackEmpty()) {
	            _this3.options.onAllTrackEmpty();
	          }
	        }
	      }
	    });
	  };
	  animationFrameLoop();
	};

	/**
	 * 弹幕停止
	 */
	Barrage.prototype.stop = function (isForPause) {
	  window.cancelAnimationFrame(this.intervalIndex);
	  window.clearTimeout(this.nextTimeoutIndex);
	  this.hasStart = isForPause ? -1 : 0;
	};

	/**
	 * 批量追加数据
	 * @param {array} dataArr 需要追加的弹幕元素列表
	 */
	Barrage.prototype.append = function (dataArr) {
	  this.data = this.data.concat(dataArr);
	};

	/**
	 * 实时发布
	 * @param {any} data
	 */
	Barrage.prototype.publish = function (data) {
	  this.data = [data].concat(_toConsumableArray(this.data));
	};

	/**
	 * 判断当前环境 animationEvent
	 * @static
	 */
	Barrage.transitionendEvent = transitionendEvent;

	module.exports = Barrage;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * requestAnimationFrame 修正方法。
	 * 获取当前浏览器 requestAnimationFrame 的兼容方法，
	 * 如果没有，用 setTimeout 代替。
	 * @private
	 * @returns {string} requestAnimationFrame 名称
	 */
	function animationFrameClosure() {
	  var lastTime = 0;
	  var vendors = ['webkit', 'moz'];
	  var x = void 0;
	  for (x = 0; x < vendors.length && !window.requestAnimationFrame; x += 1) {
	    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	    // Webkit中取消方法的名字 是 webkitCancelAnimationFrame
	    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	  }
	  // 报告环境情况
	  var animationFrame = '';
	  switch (x) {
	    case 0:
	      animationFrame = 'window.requestAnimationFrame';
	      break;
	    case 1:
	      animationFrame = 'window.webkitRequestAnimationFrame';
	      break;
	    case 2:
	      if (window.requestAnimationFrame) {
	        animationFrame = 'window.mozRequestAnimationFrame';
	      } else {
	        animationFrame = 'window.setTimeout';
	      }
	      break;
	    default:
	      break;
	  }
	  // console.log(`当前 requestAnimationFrame 使用：${animationFrame}`);
	  // 兼容方式，用 settimeout
	  if (!window.requestAnimationFrame) {
	    window.requestAnimationFrame = function (callback) {
	      var currTime = new Date().getTime();
	      var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
	      var index = window.setTimeout(function () {
	        var t = currTime + timeToCall;
	        callback(t);
	      }, timeToCall);
	      lastTime = currTime + timeToCall;
	      return index;
	    };
	  }
	  if (!window.cancelAnimationFrame) {
	    window.cancelAnimationFrame = function (index) {
	      clearTimeout(index);
	    };
	  }
	  return animationFrame;
	}

	module.exports = animationFrameClosure();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var randomFromRang = __webpack_require__(4);
	var transitionendEvent = __webpack_require__(5);

	var ONE_FRAME_TIME = 17;
	/**
	 * 弹幕跑道
	 * @private
	 */
	var BarrageTrack = function BarrageTrack(barrage, i, startTime) {
	  this.wrapper = barrage.container;
	  this.options = barrage.options;
	  this.index = i; // 弹幕跑道的索引值
	  // this.runners = [];                 // 弹幕跑道当前元素（暂不用)
	  this.height = barrage.size.height / barrage.options.rowCount; // 单一跑道的宽度
	  // this.top = this._getTop();         // 设定此跑道的位置（Top）
	  this.width = barrage.size.width; // 跑道长度
	  this.runningEndTime = new Date().getTime() + startTime * 800; // 跑道空闲时刻
	  this.emptyTime = new Date().getTime();
	};

	/**
	 * 获取跑道的的额定 top
	 * @private
	 * @return {number} 跑道的初步位置(高度)
	 */
	BarrageTrack.prototype._getTop = function () {
	  var positionTop = this.height * (this.index + 1);
	  return positionTop;
	};

	/**
	 * 在跑道额定 top 的基础上，进行 top 修正
	 * @private
	 * @return {number} 跑道的修正位置(高度)
	 */
	BarrageTrack.prototype._getItemFixTop = function () {
	  var options = this.options;
	  var top = this._getTop();
	  var fixedTop = -(this.height / 2);
	  if (options.positionFix) {
	    var fix = 0;
	    if (Object.prototype.toString.call(options.positionFix) === '[object Array]') {
	      fix = randomFromRang.apply(undefined, _toConsumableArray(options.positionFix));
	    } else {
	      fix = parseFloat(options.positionFix) || 0;
	    }
	    fixedTop += fix;
	  }
	  return top + fixedTop;
	};

	/**
	 * 某一弹幕元素起跑
	 * @private
	 * @param {any} barrageItem
	 */
	BarrageTrack.prototype.go = function (barrageItem) {
	  var _this = this;

	  var ele = barrageItem.ele;
	  var options = this.options;
	  // 修正高度
	  var fixedTop = this._getItemFixTop();
	  ele.style.top = fixedTop + 'px';
	  this.wrapper.container.appendChild(barrageItem.ele);
	  setTimeout(function () {
	    //
	    ele.style.right = -ele.offsetWidth + 'px';
	    ele.style.visibility = 'visible';
	    // 跑道长度
	    var width = _this.wrapper.size.width;
	    // 运动总长度 跑道长度 + 元素自己长度
	    var animLong = ele.offsetWidth + width;
	    // 运动时长
	    var animTime = animLong / options.speed;
	    ele.style.webkitTransition = 'all ' + (animTime || 0) + 's linear';
	    ele.style.transition = 'all ' + (animTime || 0) + 's linear';
	    // 动画结束后删除自身
	    var transitionEvent = transitionendEvent();
	    if (transitionEvent) {
	      var endEvtFn = function endEvtFn() {
	        barrageItem.remove();
	        ele.removeEventListener(transitionEvent, endEvtFn, false); // 销毁事件
	      };
	      ele.addEventListener(transitionEvent, endEvtFn, false);
	    } else {
	      // 17 ms 为容错间隔时间
	      setTimeout(function () {
	        barrageItem.remove();
	      }, animTime * 1000 + ONE_FRAME_TIME);
	    }
	    setTimeout(function () {
	      // window.requestAnimationFrame(() => {
	      ele.style.webkitTransform = 'translate(-' + animLong + 'px,0)';
	      ele.style.transform = 'translate(-' + animLong + 'px,0)';
	      // });
	    }, ONE_FRAME_TIME);
	    // 此元素独占时间 / 下次跑道空出来的时间：元素运动自身长度 + 间隙最近两元素间隔时间
	    var useTime = ele.offsetWidth / options.speed;
	    if (typeof options.intervalTime === 'number') {
	      useTime = useTime + options.intervalTime;
	    } else if (Object.prototype.toString.call(options.intervalTime) === '[object Array]') {
	      useTime = useTime + randomFromRang.apply(undefined, _toConsumableArray(options.intervalTime));
	    }
	    // 此元素空出跑道时间
	    _this.runningEndTime = new Date().getTime() + useTime * 1000;
	    // 此元素完全跑出跑道时间
	    _this.emptyTime = new Date().getTime() + animTime * 1000;
	  }, ONE_FRAME_TIME);
	};

	/**
	 * 获取 barrage 配置项
	 * @private
	 * @return {object} options 配置
	 */
	BarrageTrack.prototype.getOptions = function () {
	  return this.wrapper.options;
	};

	module.exports = BarrageTrack;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * 在一范围内取一随机数
	 * @private
	 * @param {float} from 范围起始值
	 * @param {float} to 范围终止值
	 * @return {float} 随机得出的数值
	 */
	function randomFromRange(from, to) {
	  var _from = parseFloat(from);
	  var _to = parseFloat(to);
	  if (!_from || !_to) {
	    return 0;
	  }
	  return _from + (_to - _from) * Math.random();
	}

	module.exports = randomFromRange;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * 获取当前浏览器环境的 transitionEvent 事件
	 * @private
	 * @return {string} transitionEvent 事件名称
	 * @example
	 * var transitionEvent = whichTransitionEndEvent();
	 * function evtEndFn () {
	 *   e.removeEventListener(transitionEvent, evtEndFn, false);
	 * }
	 * transitionEvent && e.addEventListener(transitionEvent, evtEndFn);
	 */
	function whichTransitionEndEvent() {
	  var el = document.createElement('surface');
	  var transitions = {
	    'transition': 'transitionend',
	    'OTransition': 'oTransitionEnd',
	    'MozTransition': 'transitionend',
	    'WebkitTransition': 'webkitTransitionEnd'
	  };

	  var keys = Object.keys(transitions);
	  var evt = '';
	  for (var i = 0; i < keys.length; i += 1) {
	    var key = keys[i];
	    if (el.style[key] !== undefined) {
	      evt = transitions[key];
	    }
	  }
	  return evt;
	}

	module.exports = whichTransitionEndEvent;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * 弹幕元素对象
	 * @private
	 * @param {any} data 元素数据，简单情况下是字符串
	 * @param {object} options 相关配置
	 *        itemClass: 元素对象的自定义 class
	 *        itemMaker: 元素dom的睡在定义生成器
	 */
	var BarrageItem = function BarrageItem(text, options) {
	  this.options = options;
	  this.ele = this._createElement(text);
	};

	/**
	 * 生成一个弹幕 dom
	 * @private
	 * @param {any} text item 数据
	 * @return {element} barrage item html element
	 */
	BarrageItem.prototype._createElement = function (text) {
	  var ele = document.createElement('div');
	  ele.classList.add('barrage-item');
	  if (this.options.itemClass) {
	    ele.classList.add(this.options.itemClass);
	  }
	  if (this.options.itemMaker) {
	    ele.innerHTML = this.options.itemMaker.bind(text)(text);
	  } else {
	    ele.innerText = text.toString();
	  }
	  ele.id = 'barrage_item_' + new Date().getTime();
	  ele.style.position = 'absolute';
	  ele.style.right = 0;
	  ele.style.visibility = 'hidden';
	  ele.style.whiteSpace = 'nowrap';
	  ele.style.willChange = 'transform';
	  // ele.style.transform = 'translate(100%, 0)';
	  // ele.style.webkitTransform = 'translate(100%, 0)';
	  // 事件绑定，在这里直接用 on 来绑定元素事件，保证事件的销毁和元素一致
	  var self = this;
	  ele.onclick = function (event) {
	    self.options.onClickItem(event, self);
	  };
	  return ele;
	};

	/**
	 * 弹幕元素删除自身。
	 * @private
	 */
	BarrageItem.prototype.remove = function () {
	  this.ele.parentElement.removeChild(this.ele);
	};

	module.exports = BarrageItem;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	"use strict";

	function getWidth(ele) {
	  return ele && ele.offsetWidth;
	}
	function getHeight(ele) {
	  return ele && ele.offsetHeight;
	}

	/**
	 * 获取dom元素 width height 方法
	 * @private
	 * @param {htmlElement} ele
	 * @return {number}
	 */
	module.exports = {
	  getWidth: getWidth,
	  getHeight: getHeight
	};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * 判断某一 dom 元素是否在视窗范围内
	 * @private
	 * @param {htmlElement} ele
	 * @return {boolean} false: 不在，true: 在，undefined: 无此dom
	 */
	function isInWindow(ele) {
	  if ((typeof ele === 'undefined' ? 'undefined' : _typeof(ele)) === 'object' && ele.nodeType && ele.nodeType === 1) {
	    var clientRect = ele.getBoundingClientRect();
	    var winHeight = document.documentElement.clientHeight || document.body.clientHeight;
	    if (clientRect.bottom < 0 || clientRect.top > winHeight) {
	      return false;
	    }
	    return true;
	  }
	  return undefined;
	}

	module.exports = isInWindow;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";

	module.exports = {
	  pool: [],
	  init: function init(count) {
	    var i = 0;
	    while (i < count) {
	      this.pool.push(i);
	      i++;
	    }
	  },
	  get: function get() {
	    var i = Math.floor(this.pool.length * Math.random());
	    return this.pool.splice(i, 1)[0] || 0;
	  }
	};

/***/ })
/******/ ])
});
;
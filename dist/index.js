/*!
 * barrage - 弹幕组件
 * Author: yj1438
 * Version: v0.1.9
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Barrage=e():(t.luna=t.luna||{},t.luna.Barrage=e())}(this,function(){return function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={exports:{},id:i,loaded:!1};return t[i].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var n={};return e.m=t,e.c=n,e.p="/dist",e(0)}([function(t,e,n){t.exports=n(1)},function(t,e,n){"use strict";function i(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}var o=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};n(2);var a=n(3),s=n(6),p=n(7),u=n(5),c=n(8),l=n(9),m=function t(e,n){var i=this;if(!e)throw new Error("new Barrage(<string|element>, {}) first parameter is required!");var s=void 0;if("string"==typeof e?s=document.querySelector(e):"object"===("undefined"==typeof e?"undefined":r(e))&&e.nodeType&&1===e.nodeType&&(s=e),!s)throw new Error("Barrage container is not found!");var u=window.getComputedStyle(s);"relative"!==u.position&&"absolute"!==u.position&&"fixed"!==u.position&&(s.style.position="relative"),s.style.overflow="hidden",this.container=s,this.options=o({},t.defaultOptions,n||{}),this.data=this.options.data||[],this.size={width:p.getWidth(this.container),height:p.getHeight(this.container)},l.init(this.options.rowCount);for(var c=[],m=this.options.rowCount;m--;)c[m]=0;this.tracks=c.map(function(t,e){var n=new a(i,e,l.get());return n.wrapper=i,n}),this.hasStart=0,this._bindEvent()};m.defaultOptions={data:[],isLoop:!1,rowCount:4,intervalTime:2,refreshfrequency:"auto",speed:150,positionFix:0,itemClass:"",maxDom:0,itemMaker:null,onClickItem:function(t,e){},onDataEmpty:function(){},onAllTrackEmpty:function(){}},m.prototype._getEmptyTrack=function(){for(var t=void 0,e=0,n=0;n<this.tracks.length;n+=1){var i=this.tracks[n];i.runningEndTime<(new Date).getTime()&&(!e||i.runningEndTime<e)&&(e=i.runningEndTime,t=n)}return void 0!==t?this.tracks[t]:null},m.prototype._isAllTrackEmpty=function(){return this.tracks.every(function(t){return t.emptyTime<(new Date).getTime()})},m.prototype._bindEvent=function(){var t=this;document.addEventListener("pause",function(e){1===t.hasStart&&t.stop(!0)},!1),document.addEventListener("resume",function(e){t.hasStart===-1&&t.start()},!1)},m.prototype.start=function(){var t=this;if(1!==this.hasStart){this.hasStart=1;var e=this.options,n=function n(){t.intervalIndex=window.requestAnimationFrame(function(){t.nextTimeoutIndex=window.setTimeout(function(){n()},32);var i=!0;if(e.maxDom){var o=t.container.querySelectorAll(".barrage-item");o&&o.length>=e.maxDom&&(i=!1)}c(t.container)||(i=!1);var r=t._getEmptyTrack();if(r||(i=!1),i)if(t.data.length>0){var a=t.data.splice(0,1)[0],p=new s(a,e);r.go(p),t.options.isLoop&&t.data.push(a)}else t.options.onDataEmpty(),t._isAllTrackEmpty()&&t.options.onAllTrackEmpty()})};n()}},m.prototype.stop=function(t){window.cancelAnimationFrame(this.intervalIndex),window.clearTimeout(this.nextTimeoutIndex),this.hasStart=t?-1:0},m.prototype.append=function(t){this.data=this.data.concat(t)},m.prototype.publish=function(t){this.data=[t].concat(i(this.data))},m.transitionendEvent=u,t.exports=m},function(t,e){"use strict";function n(){var t=0,e=["webkit","moz"],n=void 0;for(n=0;n<e.length&&!window.requestAnimationFrame;n+=1)window.requestAnimationFrame=window[e[n]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[e[n]+"CancelAnimationFrame"]||window[e[n]+"CancelRequestAnimationFrame"];var i="";switch(n){case 0:i="window.requestAnimationFrame";break;case 1:i="window.webkitRequestAnimationFrame";break;case 2:i=window.requestAnimationFrame?"window.mozRequestAnimationFrame":"window.setTimeout"}return window.requestAnimationFrame||(window.requestAnimationFrame=function(e){var n=(new Date).getTime(),i=Math.max(0,16.7-(n-t)),o=window.setTimeout(function(){var t=n+i;e(t)},i);return t=n+i,o}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(t){clearTimeout(t)}),i}t.exports=n()},function(t,e,n){"use strict";function i(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}var o=n(4),r=n(5),a=17,s=function(t,e,n){this.wrapper=t.container,this.options=t.options,this.index=e,this.height=t.size.height/t.options.rowCount,this.width=t.size.width,this.runningEndTime=(new Date).getTime()+800*n,this.emptyTime=(new Date).getTime()};s.prototype._getTop=function(){var t=this.height*(this.index+1);return t},s.prototype._getItemFixTop=function(){var t=this.options,e=this._getTop(),n=-(this.height/2);if(t.positionFix){var r=0;r="[object Array]"===Object.prototype.toString.call(t.positionFix)?o.apply(void 0,i(t.positionFix)):parseFloat(t.positionFix)||0,n+=r}return e+n},s.prototype.go=function(t){var e=this,n=t.ele,s=this.options,p=this._getItemFixTop();n.style.top=p+"px",this.wrapper.container.appendChild(t.ele),setTimeout(function(){n.style.right=-n.offsetWidth+"px",n.style.visibility="visible";var p=e.wrapper.size.width,u=n.offsetWidth+p,c=u/s.speed;n.style.webkitTransition="all "+(c||0)+"s linear",n.style.transition="all "+(c||0)+"s linear";var l=r();if(l){var m=function e(){t.remove(),n.removeEventListener(l,e,!1)};n.addEventListener(l,m,!1)}else setTimeout(function(){t.remove()},1e3*c+a);setTimeout(function(){n.style.webkitTransform="translate(-"+u+"px,0)",n.style.transform="translate(-"+u+"px,0)"},a);var f=n.offsetWidth/s.speed;"number"==typeof s.intervalTime?f+=s.intervalTime:"[object Array]"===Object.prototype.toString.call(s.intervalTime)&&(f+=o.apply(void 0,i(s.intervalTime))),e.runningEndTime=(new Date).getTime()+1e3*f,e.emptyTime=(new Date).getTime()+1e3*c},a)},s.prototype.getOptions=function(){return this.wrapper.options},t.exports=s},function(t,e){"use strict";function n(t,e){var n=parseFloat(t),i=parseFloat(e);return n&&i?n+(i-n)*Math.random():0}t.exports=n},function(t,e){"use strict";function n(){for(var t=document.createElement("surface"),e={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"},n=Object.keys(e),i="",o=0;o<n.length;o+=1){var r=n[o];void 0!==t.style[r]&&(i=e[r])}return i}t.exports=n},function(t,e){"use strict";var n=function(t,e){this.options=e,this.ele=this._createElement(t)};n.prototype._createElement=function(t){var e=document.createElement("div");e.classList.add("barrage-item"),this.options.itemClass&&e.classList.add(this.options.itemClass),this.options.itemMaker?e.innerHTML=this.options.itemMaker.bind(t)(t):e.innerText=t.toString(),e.id="barrage_item_"+(new Date).getTime(),e.style.position="absolute",e.style.right=0,e.style.visibility="hidden",e.style.whiteSpace="nowrap",e.style.willChange="transform";var n=this;return e.onclick=function(t){n.options.onClickItem(t,n)},e},n.prototype.remove=function(){this.ele.parentElement.removeChild(this.ele)},t.exports=n},function(t,e){"use strict";function n(t){return t&&t.offsetWidth}function i(t){return t&&t.offsetHeight}t.exports={getWidth:n,getHeight:i}},function(t,e){"use strict";function n(t){if("object"===("undefined"==typeof t?"undefined":i(t))&&t.nodeType&&1===t.nodeType){var e=t.getBoundingClientRect(),n=document.documentElement.clientHeight||document.body.clientHeight;return!(e.bottom<0||e.top>n)}}var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};t.exports=n},function(t,e){"use strict";t.exports={pool:[],init:function(t){for(var e=0;e<t;)this.pool.push(e),e++},get:function(){var t=Math.floor(this.pool.length*Math.random());return this.pool.splice(t,1)[0]||0}}}])});
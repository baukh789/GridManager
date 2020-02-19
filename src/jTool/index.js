import Sizzle from './Sizzle';
import utils, { extend, each } from './utils';
import ajax from './Ajax';
import _Event from './Event';
import _Css from './Css';
import _Class from './Class';
import _Document from './Document';
import _Offset from './Offset';
import _Element from './Element';
import _Animate from './Animate';
import _Data from './Data';

// 如果需要集成Angular,React,在此处进行集成
const jTool = function (selector, context) {
	return new Sizzle(selector, context);
};

// 把jquery原先的jQuery.fn给省略了.原先的方式是 init = jQuery.fn.init; init.prototype = jQuery.fn;
Sizzle.prototype = jTool.prototype = {};
// 捆绑jTool 工具
jTool.extend = jTool.prototype.extend = extend;
jTool.extend(utils);
jTool.ajax = ajax;

// 捆绑jTool 方法
each([_Event, _Css, _Class, _Document, _Offset, _Element, _Animate, _Data], (i, v) => {
    jTool.prototype.extend(v);
});

// 抛出全局变量jTool
window.jTool = jTool;

export default jTool;

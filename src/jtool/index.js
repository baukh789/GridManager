import Sizzle from './Sizzle';
import Extend from './extend';
import utils from './utils';
import Ajax from './ajax';
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
jTool.extend = jTool.prototype.extend = Extend;
jTool.extend(utils);
jTool.extend(Ajax);

// 捆绑jTool 方法
jTool.prototype.extend(_Event);
jTool.prototype.extend(_Css);
jTool.prototype.extend(_Class);
jTool.prototype.extend(_Document);
jTool.prototype.extend(_Offset);
jTool.prototype.extend(_Element);
jTool.prototype.extend(_Animate);
jTool.prototype.extend(_Data);

// 抛出全局变量jTool
window.jTool = jTool;

export default jTool;

import Sizzle from './Sizzle';
import { DOM_LIST, JTOOL_KEY } from './constants';

export default {
	// 获取指定DOM Element
	get: function (index) {
		return this[DOM_LIST][index];
	},

	// 获取指定索引的jTool对象
	eq: function (index) {
		return new Sizzle(this[DOM_LIST][index]);
	},

	// 返回指定选择器的jTool对象
	find: function (selectText) {
		return new Sizzle(selectText, this);
	},

	// 获取当前元素在指定元素中的索引, 当无参数时为当前同级元素中的索引
	index: function (nodeList) {
		const node = this[DOM_LIST][0];
		// 查找范围参数为空时,找寻同层节点
		if (!nodeList) {
			nodeList = node.parentNode.children;
		} else if (nodeList[JTOOL_KEY]) { // 查找范围参数为jTool对象,则使用对象的DOMList
			nodeList = nodeList[DOM_LIST];
		}
		return nodeList ? [].indexOf.call(nodeList, node) : -1;
	}
};

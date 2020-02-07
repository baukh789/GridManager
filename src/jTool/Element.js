import Sizzle from './Sizzle';

export default {
	// 获取指定DOM Element
	get: function (index) {
		return this.DOMList[index];
	},

	// 获取指定索引的jTool对象
	eq: function (index) {
		return new Sizzle(this.DOMList[index]);
	},

	// 返回指定选择器的jTool对象
	find: function (selectText) {
		return new Sizzle(selectText, this);
	},

	// 获取当前元素在指定元素中的索引, 当无参数时为当前同级元素中的索引
	index: function (nodeList) {
		var node = this.DOMList[0];
		// 查找范围参数为空时,找寻同层节点
		if (!nodeList) {
			nodeList = node.parentNode.children;
		} else if (nodeList.jTool) { // 查找范围参数为jTool对象,则使用对象的DOMList
			nodeList = nodeList.DOMList;
		}
		return nodeList ? [].indexOf.call(nodeList, node) : -1;
	}
};

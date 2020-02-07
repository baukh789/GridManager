/*
 * 位置
 * #Offset001: 	返回值是ClientRect对象集合，该对象是与该元素相关的CSS边框。
 * 				每个ClientRect对象包含一组描述该边框的只读属性——left、top、right和bottom，单位为像素，这些属性值是相对于视口的top-left的。
 * 				即使当表格的标题在表格的边框外面，该标题仍会被计算在内。
 * #Offset001:  Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置。
 * 				返回值包含了一组用于描述边框的只读属性——left、top、right和bottom，单位为像素。除了 width 和 height 外的属性都是相对于视口的左上角位置而言的。
 * 				返回如{top: 8, right: 1432, bottom: 548, left: 8, width: 1424…}
 * #Offset003:	原先offset()方法使用的是递归形式: 递增寻找position !== static的父级节点offsetTop或offsetLeft的值, 直到node.nodeType !== 1的时候停止
 * 				这种方法正常情况下没什么问题, 但是当body的position !== static时, 所计算的offset值将不包含scroll卷去的值
 * */
import { getStyle, isWindow } from './utils';

export default {

	// #Offset003
	// 获取匹配元素在当前视口的相对偏移
	offset: function () {
		let offest = {
			top: 0,
			left: 0
		};
		const node = this.DOMList[0];
		// #Offset001
		// 当前为IE11以下, 直接返回{top: 0, left: 0}
		if (!node.getClientRects().length) {
			return offest;
		}
		// 当前DOM节点的 display === 'node' 时, 直接返回{top: 0, left: 0}
		if (getStyle(node, 'display') === 'none') {
			return offest;
		}
		// #Offset002
		offest = node.getBoundingClientRect();
		var docElement = node.ownerDocument.documentElement;
		return {
			top: offest.top + window.pageYOffset - docElement.clientTop,
			left: offest.left + window.pageXOffset - docElement.clientLeft
		};

	},
	// 获取|设置 匹配元素相对滚动条顶部的偏移 value is number
	scrollTop: function (value) {
		return this.scrollFN(value, 'top');
	},
	// 获取|设置 匹配元素相对滚动条左部的偏移 value is number
	scrollLeft: function (value) {
		return this.scrollFN(value, 'left');
	},
	// 根据参数对位置操作进行get,set分类操作
	scrollFN: function (value, type) {
		const node = this.DOMList[0];
		// setter
		if (value || value === 0) {
			this.setScrollFN(node, type, value);
			return this;
		} else { // getter
			return this.getScrollFN(node, type);
		}
	},
	// 根据元素的不同对滚动轴进行获取
	getScrollFN: function (node, type) {
		// node => window
		if (isWindow(node)) {
			return type === 'top' ? node.pageYOffset : node.pageXOffset;
		} else if (node.nodeType === 9) { // node => document
			return type === 'top' ? node.body.scrollTop : node.body.scrollLeft;
		} else if (node.nodeType === 1) { // node => element
			return type === 'top' ? node.scrollTop : node.scrollLeft;
		}
	},
	// 根据元素的不同对滚动轴进行设置
	setScrollFN: function (node, type, value) {
		// node => window
		if (isWindow(node)) {
			type === 'top' ? node.document.body.scrollTop = value : node.document.body.scrollLeft = value;
		} else if (node.nodeType === 9) { // node => document
			type === 'top' ? node.body.scrollTop = value : node.body.scrollLeft = value;
		} else if (node.nodeType === 1) { // node => element
			type === 'top' ? node.scrollTop = value : node.scrollLeft = value;
		}
	}
};

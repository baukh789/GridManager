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
import { getStyle, isNumber } from './utils';

/**
 * 根据参数对位置操作进行get,set分类操作
 * @param node
 * @param value
 * @param type
 * @returns {undefined|number|*}
 */
const scrollFN = (node, value, type) => {
    // scroll 对应 element 属性
    const scrollAttr = {
        top: 'scrollTop',
        left: 'scrollLeft'
    }[type];

    // 转换: node === document
    if (node.nodeType === 9) {
        node = node.body;
    }

    // setter
    if (isNumber(value)) {
        node[scrollAttr] = value;
        return this;
    }

    // getter
    return node[scrollAttr];
};
export default {

	// #Offset003
	// 获取匹配元素在当前视口的相对偏移
	offset: function () {
		let position = {
			top: 0,
			left: 0
		};
		const node = this.DOMList[0];

		// #Offset001
		// 当前为IE11以下, 直接返回{top: 0, left: 0}
		if (!node.getClientRects().length) {
			return position;
		}

		// 当前DOM节点的 display === 'node' 时, 直接返回{top: 0, left: 0}
		if (getStyle(node, 'display') === 'none') {
			return position;
		}

		// #Offset002
        position = node.getBoundingClientRect();
		const docElement = node.ownerDocument.documentElement;
		return {
			top: position.top + pageYOffset - docElement.clientTop,
			left: position.left + pageXOffset - docElement.clientLeft
		};

	},
	// 获取|设置 匹配元素相对滚动条顶部的偏移 value is number
	scrollTop: function (value) {
		return scrollFN(this.DOMList[0], value, 'top');
	},
	// 获取|设置 匹配元素相对滚动条左部的偏移 value is number
	scrollLeft: function (value) {
		return scrollFN(this.DOMList[0], value, 'left');
	}
};

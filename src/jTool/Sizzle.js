import { isWindow, createDOM, each, isString, isNodeList, isElement, isArray, isJTool } from './utils';
import { DOM_LIST, JTOOL_KEY } from './constants';

export default function Sizzle(selector, context) {
    let DOMList = (() => {
        // selector -> undefined || null
        if (!selector) {
            selector = null;
            return;
        }

        // selector: window || document || Element
        if (isWindow(selector) || selector === document || isElement(selector)) {
            return [selector];
        }

        // selector: NodeList || Array
        if (isNodeList(selector) || isArray(selector)) {
            return selector;
        }

        // selector: jTool Object
        if (isJTool(selector)) {
            return selector[DOM_LIST];
        }

        // selector: Html String
        if (/<.+>/.test(selector)) {
            return createDOM(selector.trim());
        }

        // 以下的selector都为 css选择器
        // selector: css selector, 仅在selector为CSS选择器时，context才会生效
        // context -> undefined
        if (!context) {
            return document.querySelectorAll(selector);
        }

        // context: 字符CSS选择器
        if (isString(context)) {
            context = document.querySelectorAll(context);
        }

        // context: DOM 将HTMLElement转换为数组
        if (isElement(context)) {
            context = [context];
        }

        // context: jTool Object
        if (isJTool(context)) {
            context = context[DOM_LIST];
        }

        const list = [];
        each(context, v => {
            // NodeList 只是类数组, 直接使用 concat 并不会将两个数组中的参数边接, 而是会直接将 NodeList 做为一个参数合并成为二维数组
            each(v.querySelectorAll(selector), v2 => {
                v2 && list.push(v2);
            });
        });
        return list;
    })();

    if (!DOMList || DOMList.length === 0) {
        DOMList = undefined;
    }

    // 用于确认是否为jTool对象
    this[JTOOL_KEY] = true;

    // 用于存储当前选中的节点
    this[DOM_LIST] = DOMList;
    this.length = DOMList ? DOMList.length : 0;

    // 存储选择器条件
    this.querySelector = selector;

    return this;
}

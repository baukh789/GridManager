import { isWindow, createDOM, each, isString, isNodeList, isElement, isArray, isJTool, rootDocument } from './utils';
import { DOM_LIST, JTOOL_KEY } from './constants';

interface JTool {
    jTool: boolean;
}
const Sizzle = function (selector: undefined | null | Window | Document | HTMLElement | NodeList | Array<HTMLElement> | string,
                               context?: JTool | HTMLElement | NodeList | string): JTool {
    let DOMList = (() => {
        // selector -> undefined || null
        if (!selector) {
            selector = null;
            return;
        }

        // selector: window || document || Element
        if (isWindow(selector) || selector === rootDocument || isElement(selector)) {
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
        if (/<.+>/.test(selector as string)) {
            return createDOM((selector as string).trim());
        }

        // 以下的selector都为 css选择器
        // selector: css selector, 仅在selector为CSS选择器时，context才会生效
        // context -> undefined
        if (!context) {
            return rootDocument.querySelectorAll(selector as string);
        }

        // context: 字符CSS选择器
        if (isString(context)) {
            context = rootDocument.querySelectorAll(context as string) as NodeList;
        }

        // context: DOM 将HTMLElement转换为数组
        if (isElement(context)) {
            // @ts-ignore
            context = [context];
        }

        // context: jTool Object
        if (isJTool(context)) {
            context = context[DOM_LIST];
        }

        const list: Array<HTMLElement> = [];
        each(context, (v: HTMLElement) => {
            // NodeList 只是类数组, 直接使用 concat 并不会将两个数组中的参数边接, 而是会直接将 NodeList 做为一个参数合并成为二维数组
            each(v.querySelectorAll(selector as string), (v2: HTMLElement) => {
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
} as any as {
    new (selector: undefined | null | Window | Document | HTMLElement | NodeList | Array<HTMLElement> | string,
         context?: JTool | HTMLElement | NodeList | string): JTool;
};
export default Sizzle;

import Sizzle from './Sizzle';
import { each, createDOM, isUndefined, isString, isElement, isNumber, isJTool, getDomList } from './utils';

interface JTool {
    jTool: boolean;
}
export default {
    /**
     * 向元素的尾部添加节点
     * @param childList
     * @returns {default|*}
     */
    append: function (childList: string | HTMLElement | JTool): JTool {
        return this.html(childList, 'append');
    },

    /**
     * 向元素的头部添加节点
     * @param childList
     * @returns {default|*}
     */
    prepend: function (childList: string | HTMLElement | JTool): JTool {
        return this.html(childList, 'prepend');
    },

    /**
     * 向元素前方添加节点
     * @param node
     * @returns {default}
     */
    before: function (node: HTMLElement | JTool): JTool {
        if(isJTool(node)) {
            node = getDomList(node as JTool, 0) as HTMLElement;
        }
        const thisNode = getDomList(this, 0) as HTMLElement;
        const parentEl = thisNode.parentNode;
        parentEl.insertBefore(node as HTMLElement, thisNode);
        return this;
    },

    /**
     * 向元素后方添加节点
     * @param node
     */
    after: function (node: HTMLElement | JTool): void {
        if(isJTool(node)) {
            node = getDomList(node as JTool, 0) as HTMLElement;
        }
        const thisNode = getDomList(this, 0) as HTMLElement;
        const parentEl = thisNode.parentNode;
        if (parentEl.lastChild === thisNode) {
            parentEl.appendChild(node as HTMLElement);
        }else{
            parentEl.insertBefore(node as HTMLElement, thisNode.nextSibling);
        }
    },

    /**
     * 获取或设置元素的innerText
     * @param text
     * @returns {string|default}
     */
    text: function (text?: string): JTool | string {
        // setter
        if (!isUndefined(text)) {
            each(this, (v: HTMLElement) => {
                v.textContent = text;
            });
            return this;
        }

        // getter
        return getDomList(this, 0).textContent;
    },

    /**
     * 获取或设置元素的innerHTML
     * @param childList
     * @param insertType
     * @returns {default|*}
     */
    html: function (childList?: any, insertType?: string): JTool | string {
        const DOMList = getDomList(this);
        // getter
        if (isUndefined(childList) && isUndefined(insertType)) {
            return DOMList[0].innerHTML;
        }

        // setter: jtool
        if (isJTool(childList)) {
            childList = getDomList(childList);
        }

        // setter: string || number
        if (isString(childList) || isNumber(childList)) {
            childList = createDOM(childList);
        }

        // setter: element
        if (isElement(childList)) {
            childList = [childList];
        }

        let firstChild: Node;
        each(DOMList, (element: HTMLElement) => {
            // html
            if(!insertType) {
                element.innerHTML = '';
            }

            // prepend
            if (insertType === 'prepend') {
                firstChild = element.firstChild;
            }

            each(childList, (child: Node) => {
                // todo baukh@20200512: 在做fixed的时候，发现这行cloneNode可能没用，后续确后清除
                child = child.cloneNode(true);
                if(firstChild) {
                    element.insertBefore(child, firstChild);
                } else {
                    element.appendChild(child);
                }

                // 将当前节点和它的后代节点”规范化“, 相关链接: https://developer.mozilla.org/zh-CN/docs/Web/API/Node/normalize
                element.normalize();
            });
        });
        return this;
    },

    /**
     * 为当前元素添加父元素
     * @param elementText
     * @param content
     * @returns {default}
     */
    wrap: function (elementText: string, content: string) {
        // 简化了wrap功能，仅满足gm自身
        const wrap = createDOM(elementText)[0] as HTMLElement;
        const dom = getDomList(this, 0);

        dom.parentNode.insertBefore(wrap, dom);
        wrap.querySelector(content).appendChild(dom);
    },
    /**
     * 向上寻找匹配节点
     * @param selectorText
     */
    closest: function (selectorText?: string): JTool {
        const node = getDomList(this, 0);
        // 当前选择器文本为空
        if (isUndefined(selectorText)) {
            return new Sizzle(node.parentNode);
        }
        return new Sizzle(node.closest(selectorText));
    },

    /**
     * 获取当前元素父级,返回jTool对象
     * @returns {default}
     */
    parent: function (): JTool {
        return this.closest();
    },

    /**
     * 克隆节点: 参数deep克隆节点及其后代
     * @param deep
     */
    clone: function (deep: boolean): JTool {
        return new Sizzle(getDomList(this, 0).cloneNode(deep || false));
    },

    /**
     * 批量删除节点
     */
    remove: function (): void {
        each(this, (v: HTMLElement) => {
            v.remove();
        });
    }
};

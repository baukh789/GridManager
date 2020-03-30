import Sizzle from './Sizzle';
import { each, createDOM, isUndefined, isString, isElement, isNumber } from './utils';
import { DOM_LIST, JTOOL_KEY } from './constants';

export default {
    /**
     * 向元素的尾部添加节点
     * @param childList
     * @returns {default|*}
     */
    append: function (childList) {
        return this.html(childList, 'append');
    },

    /**
     * 向元素的头部添加节点
     * @param childList
     * @returns {default|*}
     */
    prepend: function (childList) {
        return this.html(childList, 'prepend');
    },

    /**
     * 向元素前方添加节点
     * @param node
     * @returns {default}
     */
    before: function (node) {
        if(node[JTOOL_KEY]) {
            node = node[DOM_LIST][0];
        }
        const thisNode = this[DOM_LIST][0];
        const parentEl = thisNode.parentNode;
        parentEl.insertBefore(node, thisNode);
        return this;
    },

    /**
     * 向元素后方添加节点
     * @param node
     */
    after: function (node) {
        if(node[JTOOL_KEY]) {
            node = node[DOM_LIST][0];
        }
        const thisNode = this[DOM_LIST][0];
        const parentEl = thisNode.parentNode;
        if (parentEl.lastChild === thisNode) {
            parentEl.appendChild(node);
        }else{
            parentEl.insertBefore(node, thisNode.nextSibling);
        }
    },

    /**
     * 获取或设置元素的innerText
     * @param text
     * @returns {string|default}
     */
    text: function (text) {
        const DOMList = this[DOM_LIST];
        // setter
        if (!isUndefined(text)) {
            each(DOMList, function (i, v) {
                v.textContent = text;
            });
            return this;
        }

        // getter
        return DOMList[0].textContent;
    },

    /**
     * 获取或设置元素的innerHTML
     * @param childList
     * @param insertType
     * @returns {default|*}
     */
    html: function (childList, insertType) {
        const DOMList = this[DOM_LIST];
        // getter
        if (isUndefined(childList) && isUndefined(insertType)) {
            return DOMList[0].innerHTML;
        }

        // setter: jtool
        if (childList[JTOOL_KEY]) {
            childList = childList[DOM_LIST];
        }

        // setter: string || number
        if (isString(childList) || isNumber(childList)) {
            childList = createDOM(childList);
        }

        // setter: element
        if (isElement(childList)) {
            childList = [childList];
        }

        let firstChild = null;
        each(DOMList, function (e, element) {
            // html
            if(!insertType) {
                element.innerHTML = '';
            }

            // prepend
            if (insertType === 'prepend') {
                firstChild = element.firstChild;
            }

            each(childList, function (c, child) {
                child = child.cloneNode(true);
                // text node todo @baukh20200330: 当前为文本节点时， nodeType是3而不是空。这块的逻辑可能已经无用了
                // if(!child.nodeType) {
                //     child = document.createTextNode(child);
                // }
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
    wrap: function (elementText, content) {
        // 简化了wrap功能，仅满足gm自身
        const wrap = createDOM(elementText)[0];
        const dom = this[DOM_LIST][0];

        dom.parentNode.insertBefore(wrap, dom);
        wrap.querySelector(content).appendChild(dom);
    },
    /**
     * 向上寻找匹配节点
     * @param selectorText
     */
    closest: function (selectorText) {
        let parentDOM = this[DOM_LIST][0].parentNode;
        if (isUndefined(selectorText)) {
            return new Sizzle(parentDOM);
        }
        const target = document.querySelectorAll(selectorText);

        // 递归查找匹配的父级元素
        function getParentNode() {
            if (!parentDOM || !target.length || parentDOM.nodeType !== 1) {
                parentDOM = null;
                return;
            }

            if ([].indexOf.call(target, parentDOM) !== -1) {
                return;
            }

            parentDOM = parentDOM.parentNode;

            getParentNode();
        }

        getParentNode();

        return new Sizzle(parentDOM);
    },

    /**
     * 获取当前元素父级,返回jTool对象
     * @returns {default}
     */
    parent: function () {
        return this.closest();
    },

    /**
     * 克隆节点: 参数deep克隆节点及其后代
     * @param deep
     */
    clone: function (deep) {
        return new Sizzle(this[DOM_LIST][0].cloneNode(deep || false));
    },

    /**
     * 批量删除节点
     */
    remove: function () {
        each(this[DOM_LIST], function (i, v) {
            v.remove(); // v.parentNode.removeChild(v);
        });
    }
};

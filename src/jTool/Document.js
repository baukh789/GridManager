import Sizzle from './Sizzle';
import { each, createDOM, isUndefined, isString, isElement, isNumber } from './utils';

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
        if(node.jTool) {
            node = node.DOMList[0];
        }
        const thisNode = this.DOMList[0];
        const parentEl = thisNode.parentNode;
        parentEl.insertBefore(node, thisNode);
        return this;
    },

    /**
     * 向元素后方添加节点
     * @param node
     */
    after: function (node) {
        if(node.jTool) {
            node = node.DOMList[0];
        }
        const thisNode = this.DOMList[0];
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
        // setter
        if (!isUndefined(text)) {
            each(this.DOMList, function (i, v) {
                v.textContent = text;
            });
            return this;
            // getter
        } else {
            return this.DOMList[0].textContent;
        }
    },

    /**
     * 获取或设置元素的innerHTML
     * @param childList
     * @param insertType
     * @returns {default|*}
     */
    html: function (childList, insertType) {
        // getter
        if (isUndefined(childList) && isUndefined(insertType)) {
            return this.DOMList[0].innerHTML;
        }
        // setter
        if (childList.jTool) {
            childList = childList.DOMList;
        }

        if (isString(childList)) {
            childList = createDOM(childList || '');
        }

        if (isNumber(childList)) {
            childList = createDOM(childList.toString() || '');
        }

        if (isElement(childList)) {
            childList = [childList];
        }

        let firstChild = null;
        each(this.DOMList, function (e, element) {
            // html
            if(!insertType) {
                element.innerHTML = '';
            } else if (insertType === 'prepend') { // prepend
                firstChild = element.firstChild;
            }
            each(childList, function (c, child) {
                child = child.cloneNode(true);
                // text node
                if(!child.nodeType) {
                    child = document.createTextNode(child);
                }
                if(firstChild) {
                    element.insertBefore(child, firstChild);
                } else {
                    element.appendChild(child);
                }
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
        each(this.DOMList, function (i, v) {
            const wrap = new Sizzle(elementText, v.ownerDocument).get(0);
            v.parentNode.insertBefore(wrap, v);
            // 当未指定原节点所在容器时，将原节点添加入wrap中第一个为空的节点内
            content ? wrap.querySelector(content).appendChild(v) : wrap.querySelector(':empty').appendChild(v);
        });
        return this;
    },
    /**
     * 向上寻找匹配节点
     * @param selectorText
     */
    closest: function (selectorText) {
        let parentDOM = this.DOMList[0].parentNode;
        if (isUndefined(selectorText)) {
            return new Sizzle(parentDOM);
        }
        const target = document.querySelectorAll(selectorText);

        // 递归查找匹配的父级元素
        function getParentNode() {
            if (!parentDOM || target.length === 0 || parentDOM.nodeType !== 1) {
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
        return new Sizzle(this.DOMList[0].cloneNode(deep || false));
    },

    /**
     * 批量删除节点
     */
    remove: function () {
        each(this.DOMList, function (i, v) {
            v.parentNode.removeChild(v);
        });
    }
};

import Sizzle from './Sizzle';
import { each, createDOM, isUndefined, isString, isElement, isNumber, isJTool, getDomList } from './utils';

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
        if(isJTool(node)) {
            node = getDomList(node, 0);
        }
        const thisNode = getDomList(this, 0);
        const parentEl = thisNode.parentNode;
        parentEl.insertBefore(node, thisNode);
        return this;
    },

    /**
     * 向元素后方添加节点
     * @param node
     */
    after: function (node) {
        if(isJTool(node)) {
            node = getDomList(node, 0);
        }
        const thisNode = getDomList(this, 0);
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
            each(this, v => {
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
    html: function (childList, insertType) {
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

        let firstChild;
        each(DOMList, element => {
            // html
            if(!insertType) {
                element.innerHTML = '';
            }

            // prepend
            if (insertType === 'prepend') {
                firstChild = element.firstChild;
            }

            each(childList, child => {
                // todo baukh@20200512: 在做fixed的时候，发现这行cloneNode可能没用，后续确后清除
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
        const dom = getDomList(this, 0);

        dom.parentNode.insertBefore(wrap, dom);
        wrap.querySelector(content).appendChild(dom);
    },
    /**
     * 向上寻找匹配节点
     * @param selectorText
     */
    closest: function (selectorText) {
        let parentDOM = getDomList(this, 0).parentNode;
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
        return new Sizzle(getDomList(this, 0).cloneNode(deep || false));
    },

    /**
     * 批量删除节点
     */
    remove: function () {
        each(this, v => {
            v.remove(); // v.parentNode.removeChild(v);
        });
    }
};

import Sizzle from './Sizzle';
import { each, createDOM, isUndefined, isString, isElement, isNumber } from './utils';

export default {
    append: function (childList) {
        return this.html(childList, 'append');
    },

    prepend: function (childList) {
        return this.html(childList, 'prepend');
    },

    before: function (node) {
        if(node.jTool) {
            node = node.DOMList[0];
        }
        const thisNode = this.DOMList[0];
        const parentEl = thisNode.parentNode;
        parentEl.insertBefore(node, thisNode);
        return this;
    },

    after: function (node) {
        if(node.jTool) {
            node = node.DOMList[0];
        }
        var thisNode = this.DOMList[0];
        var parentEl = thisNode.parentNode;
        if (parentEl.lastChild === thisNode) {
            parentEl.appendChild(node);
        }else{
            parentEl.insertBefore(node, thisNode.nextSibling);
        }
        //  parentEl.insertBefore(node, thisNode);
    },
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
    wrap: function (elementText, content) {
        each(this.DOMList, function (i, v) {
            const wrap = new Sizzle(elementText, v.ownerDocument).get(0);
            v.parentNode.insertBefore(wrap, v);
            // 当未指定原节点所在容器时，将原节点添加入wrap中第一个为空的节点内
            content ? wrap.querySelector(content).appendChild(v) : wrap.querySelector(':empty').appendChild(v);
        });
        return this;
    },
    // 向上寻找匹配节点
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

    // 获取当前元素父级,返回jTool对象
    parent: function () {
        return this.closest();
    },
    // 克隆节点: 参数deep克隆节点及其后代
    clone: function (deep) {
        return new Sizzle(this.DOMList[0].cloneNode(deep || false));
    },
    // 批量删除节点
    remove: function () {
        each(this.DOMList, function (i, v) {
            // v.remove IE 所有版本都不支持, 使用removeChild替换
            // v.remove();
            v.parentNode.removeChild(v);
        });
    }
};

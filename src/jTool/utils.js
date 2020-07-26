import { DOM_LIST, JTOOL_KEY, JTOOL_DOM_ID } from './constants';
const typeMap = {
    '[object String]': 'string',
    '[object Boolean]': 'boolean',
    '[object Undefined]': 'undefined',
    '[object Number]': 'number',
    '[object Object]': 'object',
    '[object Error]': 'error',
    '[object Function]': 'function',
    '[object Date]': 'date',
    '[object Array]': 'array',
    '[object RegExp]': 'regexp',
    '[object Null]': 'null',
    '[object NodeList]': 'nodeList',
    '[object Arguments]': 'arguments',
    '[object Window]': 'window',
    '[object HTMLDocument]': 'document'
};

export const isWindow = object => {
    return object && object === object.window;
};

export const type = object => {
    return object instanceof Element ? 'element' : typeMap[Object.prototype.toString.call(object)];
};

export const noop = () => {};

export const each = (object, callback) => {
    // 当前参数不可用，直接跳出
    if (!object) {
        return;
    }

    // 当前为jTool对象,循环目标更换为jTool.DOMList
    if (object[JTOOL_KEY]) {
        object = object[DOM_LIST];

        // DOM_LIST可能为空，若为空直接跳出
        if (isUndefined(object)) {
            return;
        }
    }

    // 数组或类数组: callback(value, index)
    if (!isUndefined(object.length)) {
        // 由于存在类数组 NodeList, 所以不能直接调用 every 方法
        [].every.call(object, (ele, index) => {
            // 处理jTool 对象
            if (!isWindow(ele) && ele[JTOOL_KEY]) {
                ele = ele.get(0);
            }
            return callback.call(ele, ele, index) !== false;
        });
    }

    // object: callback(key, ele)
    if (isObject(object)) {
        for(const key in object) {
            const ele = object[key];
            if(callback.call(ele, key, ele) === false) {
                break;
            }
        }
    }
};

// 获取节点样式: key为空时则返回全部
export const getStyle = (dom, key) => {
    return getComputedStyle(dom)[key];
};

// 通过html字符串, 生成DOM.  返回生成后的子节点
// 该方法无处处理包含table标签的字符串,但是可以处理table下属的标签
export const createDOM = htmlString => {
    let jToolDOM = document.querySelector(`#${JTOOL_DOM_ID}`);
    if (!jToolDOM) {
        // table标签 可以在新建element时可以更好的容错.
        // div标签, 添加thead,tbody等表格标签时,只会对中间的文本进行创建
        // table标签,在添加任务标签时,都会成功生成.且会对table类标签进行自动补全
        const el = document.createElement('table');
        el.id = JTOOL_DOM_ID;
        el.style.display = 'none';
        document.body.appendChild(el);
        jToolDOM = document.querySelector(`#${JTOOL_DOM_ID}`);
    }

    jToolDOM.innerHTML = isUndefined(htmlString) ? '' : htmlString;
    let childNodes = jToolDOM.childNodes;

    // 进行table类标签清理, 原因是在增加如th,td等table类标签时,浏览器会自动补全节点.
    if (childNodes.length === 1) {
        const firstNode = childNodes[0];
        const firstNodeName = firstNode.nodeName;
        const firstChildNodes = firstNode.childNodes;
        if ((!/<tbody|<TBODY/.test(htmlString) && firstNodeName === 'TBODY')
        || (!/<thead|<THEAD/.test(htmlString) && firstNodeName === 'THEAD')
        || (!/<tr|<TR/.test(htmlString) &&  firstNodeName === 'TR')
        || (!/<td|<TD/.test(htmlString) && firstNodeName === 'TD')
        || (!/<th|<TH/.test(htmlString) && firstNodeName === 'TH')) {
            childNodes = firstChildNodes;
        }
    }

    document.body.removeChild(jToolDOM);
    return childNodes;
};

/**
 * 是否为 undefined
 * @param o
 * @returns {boolean}
 */
export const isUndefined = o => {
    return type(o) === 'undefined';
};

/**
 * 是否为 null
 * @param o
 * @returns {boolean}
 */
export const isNull = o => {
    return type(o) === 'null';
};
/**
 * 是否为 string
 * @param o
 * @returns {boolean}
 */
export const isString = o => {
    return type(o) === 'string';
};

/**
 * 是否为 function
 * @param o
 * @returns {boolean}
 */
export const isFunction = o => {
    return type(o) === 'function';
};

/**
 * 是否为 number
 * @param o
 * @returns {boolean}
 */
export const isNumber = o => {
    return type(o) === 'number';
};

/**
 * 是否为 boolean
 * @param o
 * @returns {boolean}
 */
export const isBoolean = o => {
    return type(o) === 'boolean';
};

/**
 * 是否为 object
 * @param o
 * @returns {boolean}
 */
export const isObject = o => {
    return type(o) === 'object';
};

/**
 * 是否为空对像
 * @param o
 * @returns {boolean}
 */
export const isEmptyObject = obj => {
    let isEmptyObj = true;
    for (const pro in obj) {
        if(obj.hasOwnProperty(pro)) {
            isEmptyObj = false;
        }
    }
    return isEmptyObj;
};

/**
 * 是否为 array
 * @param o
 * @returns {boolean}
 */
export const isArray = o => {
    return type(o) === 'array';
};

/**
 * 是否为可用的数组
 * @param a
 */
export const isValidArray = o => {
    return isArray(o) && o.length > 0;
};

/**
 * 是否为 element
 * @param o
 * @returns {boolean}
 */
export const isElement = o => {
    return type(o) === 'element';
};

/**
 * 是否为 nodeList
 * @param o
 * @returns {boolean}
 */
export const isNodeList = o => {
    return type(o) === 'nodeList';
};

/**
 * 合并
 * 未对数组进行递归的原因: 框架中会为列配置项添加字段，这会导致出现内存溢出问题
 * @returns {{}}
 */
export function extend() {
    // 参数为空,返回空对象
    if (arguments.length === 0) {
        return {};
    }

    let deep = false; // 是否递归
    let	i = 1;
    let	target = arguments[0];
    let	options;

    // 参数只有一个且为对象类形 -> 对jTool进行扩展
    if (arguments.length === 1 && isObject(arguments[0])) {
        target = this;
        i = 0;
    } else if (arguments.length === 2 && isBoolean(arguments[0])) { // 参数为两个, 且第一个为布尔值 -> 对jTool进行扩展
        deep = arguments[0];
        target = this;
        i = 1;
    } else if(arguments.length > 2 && isBoolean(arguments[0])) { // 参数长度大于2, 且第一个为布尔值 -> 对第二个Object进行扩展
        deep = arguments[0];
        target = arguments[1] || {};
        i = 2;
    }
    for (; i < arguments.length; i++) {
        options = arguments[i] || {};
        ex(options, target);
    }
    function ex(options, target) {
        for (let key in options) {
            if (options.hasOwnProperty(key)) {
                // 数组不进行递归
                if(deep && isObject(options[key])) {
                    if(!isObject(target[key])) {
                        target[key] = {};
                    }
                    ex(options[key], target[key]);
                } else {
                    target[key] = options[key];
                }
            }
        }
    }
    return target;
}
export default {
    isWindow,
    noop,
    type,
    getStyle,
    isEmptyObject,
    each
};

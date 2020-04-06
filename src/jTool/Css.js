import { getStyle, isObject, isNumber, isString, each, isUndefined } from './utils';
import { DOM_LIST } from './constants';

/**
 * 当前属性的单位是否为px
 * @param name
 * @returns {boolean}
 */
const isPxAttr = name => {
    return ['width', 'height', 'top', 'left', 'right', 'bottom', 'padding', 'margin'].some(key => name.indexOf(key) !== -1);
};

/**
 * 设置样式
 * @param DOMList
 * @param name
 * @param val
 */
function setStyle(DOMList, name, val) {
    const PX = 'px';
    if (isNumber(val)) {
        val = val.toString();
    }
    if (val.indexOf(PX) === -1 && isPxAttr(name)) {
        val = val + PX;
    }
    each(DOMList, v => {
        v.style[name] = val;
    });
}
export default {
    // 如果长度是带 px 的值, 会将其转换成 数字
    // 其他情况 不做处理, 返回对应的字符串
    // TODO 颜色处理 返回16进制颜色值, 考虑 rgba 的情况
    css: function (key, value) {
        const DOMList = this[DOM_LIST];
        // getter
        if (isString(key) && isUndefined(value)) {
            if (isPxAttr(key)) {
                return parseInt(getStyle(DOMList[0], key), 10);
            } else {
                return getStyle(DOMList[0], key);
            }
        }

        // setter
        // ex: {width:13px, height:10px}
        if (isObject(key)) {
            for(const k in key) {
                setStyle(DOMList, k, key[k]);
            }
        } else { // ex: width, 13px
            setStyle(DOMList, key, value);
        }
        return this;
    },

    width: function (value) {
        return this.css('width', value);
    },

    height: function (value) {
        return this.css('height', value);
    }
};

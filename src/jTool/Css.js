import { getStyle, isObject, isNumber, isString, each } from './utils';

// 使用像素的元素列表
const pxList = ['width', 'height', 'min-width', 'max-width', 'min-height', 'min-height', 'top', 'left', 'right', 'bottom',
    'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'border-width', 'border-top-width', 'border-left-width', 'border-right-width', 'border-bottom-width'];

/**
 * 设置样式
 * @param DOMList
 * @param name
 * @param val
 */
function setStyle(DOMList, name, val) {
    if (isNumber(val)) {
        val = val.toString();
    }
    if (pxList.indexOf(name) !== -1 && val.indexOf('px') === -1) {
        val = val + 'px';
    }
    each(DOMList, (i, v) => {
        v.style[name] = val;
    });
}
export default {
    // 如果长度是带 px 的值, 会将其转换成 数字
    // 其他情况 不做处理, 返回对应的字符串
    // TODO 颜色处理 返回16进制颜色值, 考虑 rgba 的情况
    css: function (key, value) {
        const DOMList = this.DOMList;
        // getter
        if (isString(key) && (!value && value !== 0)) {
            if (pxList.indexOf(key) !== -1) {
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

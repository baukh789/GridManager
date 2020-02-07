import { getStyle, isObject, isNumber, isString, each } from './utils';
export default {
    // 如果长度是带 px 的值, 会将其转换成 数字
    // 其他情况 不做处理, 返回对应的字符串
    // TODO 颜色处理 返回16进制颜色值, 考虑 rgba 的情况
    css: function (key, value) {
        const _this = this;
        // 获取getComputedStyle 和 设置dom.style 会自已将类似于font-size 和fontSize的样式自动同步
        const pxList = ['width', 'height', 'min-width', 'max-width', 'min-height', 'min-height', 'top', 'left', 'right', 'bottom',
            'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
            'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
            'border-width', 'border-top-width', 'border-left-width', 'border-right-width', 'border-bottom-width'];

        // getter
        if (isString(key) && (!value && value !== 0)) {
            if (pxList.indexOf(key) !== -1) {
                return parseInt(getStyle(this.DOMList[0], key), 10);
            } else {
                return getStyle(this.DOMList[0], key);
            }
        }

        // setter
        // ex: {width:13px, height:10px}
        if (isObject(key)) {
            for(const k in key) {
                setStyle(k, key[k]);
            }
        } else { // ex: width, 13px
            setStyle(key, value);
        }

        function setStyle(name, val) {
            if (isNumber(val)) {
                val = val.toString();
            }
            if (pxList.indexOf(name) !== -1 && val.indexOf('px') === -1) {
                val = val + 'px';
            }
            each(_this.DOMList, function (i, v) {
                v.style[name] = val;
            });
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

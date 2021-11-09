import {getStyle, isObject, isNumber, isString, each, isUndefined, getDomList, isNull} from './utils';

/**
 * 当前属性的单位是否为px
 * @param name
 * @returns {boolean}
 */
const isPxAttr = (name: string): boolean => {
    return ['width', 'max-width', 'height', 'top', 'left', 'right', 'bottom', 'padding', 'margin'].some(key => name.indexOf(key) !== -1);
};

/**
 * 设置样式
 * @param DOMList
 * @param name
 * @param val
 */
function setStyle(DOMList: Array<HTMLElement>, name: string, val: number | string): void {
    const PX = 'px';
    if (isNull(val) || isUndefined(val)) {
        return;
    }
    if (isNumber(val)) {
        val = val.toString();
    }
    if ((val as string).indexOf(PX) === -1 && isPxAttr(name)) {
        val = val + PX;
    }
    each(DOMList, (v: HTMLElement) => {
        v.style[name] = val;
    });
}
export default {
    // 如果长度是带 px 的值, 会将其转换成 数字
    // 其他情况 不做处理, 返回对应的字符串
    css: function (key: string | object, value: string | number): string | number {
        const DOMList = getDomList(this);
        // getter
        if (isString(key) && isUndefined(value)) {
            const style = getStyle(DOMList[0], key as string);
            if (isPxAttr(key as string)) {
                // style = parseInt(style, 10);
                return parseFloat(style);
                // style = Math.round(parseFloat(style) * 100) / 100;
            }
            return style;
        }

        // setter
        // ex: {width:13px, height:10px}
        if (isObject(key)) {
            for(const k in key as object) {
                setStyle(DOMList, k, key[k]);
            }
        } else { // ex: width, 13px
            setStyle(DOMList, key as string, value);
        }
        return this;
    },

    width: function (value: number | string) {
        return this.css('width', value);
    },

    height: function (value: number | string) {
        return this.css('height', value);
    }
};

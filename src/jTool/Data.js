import { isUndefined, isNull, each } from './utils';

/**
 * 转换值: 当前为null时转换为undefined
 * @param value
 * @returns {*}
 */
const transformVal = value => {
    // null => undefined
    return isNull(value) ? undefined : value;
};

export default {
    // 普通属性
    attr: function (key, value) {
        // 未指定参数,返回空字符
        if (isUndefined(key) && isUndefined(value)) {
            return '';
        }
        // setter
        if (!isUndefined(value)) {
            each(this.DOMList, (i, v) => {
                v.setAttribute(key, value);
            });
            return this;
        } else{ // getter
            return transformVal(this.DOMList[0].getAttribute(key));
        }
    },
    // 删除普通属性
    removeAttr: function (key) {
        if (isUndefined(key)) {
            return;
        }
        each(this.DOMList, (i, v) => {
            v.removeAttribute(key);
        });
    },
    // 配置固有属性
    prop: function (key, value) {
        // 未指定参数,返回空字符
        if (isUndefined(key) && isUndefined(value)) {
            return '';
        }
        // setter
        if (!isUndefined(value)) {
            each(this.DOMList, (i, v) => {
                v[key] = value;
            });
            return this;
        } else{ // getter
            return transformVal(this.DOMList[0][key]);
        }
    },
    // 删除固有属性
    removeProp: function (key) {
        if (isUndefined(key)) {
            return;
        }
        each(this.DOMList, (i, v) => {
            delete v[key];
        });
    },
    // attr -> value
    val: function (value) {
        return this.prop('value', value) || '';
    }
};

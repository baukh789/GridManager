import { isUndefined, isNull, each } from './utils';
import { DOM_LIST } from './constants';

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
    /**
     * 普通属性
     * @param key
     * @param value
     * @returns {*}
     */
    attr: function (key, value) {
        const DOMList = this[DOM_LIST];
        // setter
        if (!isUndefined(value)) {
            each(DOMList, v => {
                v.setAttribute(key, value);
            });
            return this;
        }

        // getter
        return transformVal(DOMList[0].getAttribute(key));
    },

    /**
     * 删除普通属性
     * @param key
     */
    removeAttr: function (key) {
        each(this[DOM_LIST], v => {
            v.removeAttribute(key);
        });
    },

    /**
     * 配置固有属性
     * @param key
     * @param value
     * @returns {*}
     */
    prop: function (key, value) {
        const DOMList = this[DOM_LIST];
        // setter
        if (!isUndefined(value)) {
            each(DOMList, v => {
                v[key] = value;
            });
            return this;
        }

        // getter
        return transformVal(DOMList[0][key]);
    },

    /**
     * 删除固有属性
     * @param key
     */
    // todo baukh@20200326: 该功能在表格中未使用到
    // removeProp: function (key) {
    //     each(this[DOM_LIST], v => {
    //         delete v[key];
    //     });
    // },

    /**
     * value
     * @param value
     * @returns {*|string}
     */
    val: function (value) {
        return this.prop('value', value) || '';
    }
};

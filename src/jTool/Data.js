import { isUndefined, isNull, each, getDomList } from './utils';

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
        // setter
        if (!isUndefined(value)) {
            each(this, v => {
                v.setAttribute(key, value);
            });
            return this;
        }

        // getter
        return transformVal(getDomList(this, 0).getAttribute(key));
    },

    /**
     * 删除普通属性
     * @param key
     */
    removeAttr: function (key) {
        each(this, v => {
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
        // setter
        if (!isUndefined(value)) {
            each(this, v => {
                v[key] = value;
            });
            return this;
        }

        // getter
        return transformVal(getDomList(this, 0)[key]);
    },

    /**
     * value
     * @param value
     * @returns {*|string}
     */
    val: function (value) {
        return this.prop('value', value) || '';
    }
};

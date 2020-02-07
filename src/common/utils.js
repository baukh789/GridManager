import { CONSOLE_ERROR, CONSOLE_INFO, CONSOLE_STYLE, CONSOLE_WARN } from '@common/constants';
/**
 * 工具函数
 */

/**
 * 输出日志
 * @param s 输出文本
 * @param type 输出分类[info,warn,error]
 * @returns {*}
 */
const OUT_LOG = (s, type) => {
    console.log(`%c GridManager ${type} %c ${s} `, ...CONSOLE_STYLE[type]);
};

/**
 * 输出信息
 * @param s 输出文本
 * @returns {*}
 */
export const outInfo = s => {
    OUT_LOG(s, CONSOLE_INFO);
};

/**
 * 输出警告
 * @param s 输出文本
 * @returns {*}
 */
export const outWarn = s => {
    OUT_LOG(s, CONSOLE_WARN);
};

/**
 * 输出错误
 * @param s 输出文本
 * @returns {*}
 */
export const outError = s => {
    OUT_LOG(s, CONSOLE_ERROR);
};

/**
 * 验证两个Object是否相同
 * @param o1
 * @param o2
 * @returns {boolean}
 */
export const equal = (o1, o2) => {
    const k1 = Object.keys(o1);
    const k2 = Object.keys(o2);
    if (k1.length !== k2.length)  {
        return false;
    }

    return k1.every(key => {
        return JSON.stringify(o1[key]) === JSON.stringify(o2[key]);
    });
};

/**
 * 获取Array中Object的索引
 * @param arr
 * @param obj
 * @returns {number}
 */
export const getObjectIndexToArray = (arr, obj) => {
    let index = -1;
    let isInclude = false;
    arr.some((item, i) => {
        isInclude = equal(item, obj);
        if (isInclude) {
            index = i;
        }
        return equal(item, obj);
    });
    return index;
};

/**
 * clone 对象, 对 JSON.stringify 存在丢失的类型(如function)不作处理。因为GM中不存在这种情况
 * @param o
 * @returns {any}
 */
export const cloneObject = o => {
    return JSON.parse(JSON.stringify(o));
};

/**
 * 获取visible状态
 * @param isShow: 是否显示
 * @returns {string}
 */
export const getVisibleState = isShow => {
    return isShow ? 'visible' : 'none';
};


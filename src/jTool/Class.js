import { each } from './utils';

/**
 * 解析className 将以空格间格的字符串分割为数组
 * @param className
 * @returns {*}
 */
function parseClassName(className) {
    return className.indexOf(' ') ?  className.split(' ') : [className];
}

/**
 * 执行指定classList方法
 * @param DOMList
 * @param className
 * @param exeName
 * @returns {changeClass}
 */
function changeClass(DOMList, className, exeName) {
    const classNameList = parseClassName(className);
    each(DOMList, (i, dom) => {
        each(classNameList, (index, name) => {
            dom.classList[exeName](name);
        });
    });
    return this;
}
export default {
    addClass: function (className) {
        return changeClass(this.DOMList, className, 'add');
    },

    removeClass: function (className) {
        return changeClass(this.DOMList, className, 'remove');
    },

    toggleClass: function (className) {
        return changeClass(this.DOMList, className, 'toggle');
    },

    // 不支持多 className
    hasClass: function (className) {
        return [].some.call(this.DOMList, function (dom) {
            return dom.classList.contains(className);
        });
    }
};

import { each, getDomList } from './utils';

/**
 * 解析className 将以空格间格的字符串分割为数组
 * @param className
 * @returns {*}
 */
function parseClassName(className) {
    // 第一个空格不处理，所以indexOf的值为0也算做一个className
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
    each(DOMList, dom => {
        each(classNameList, name => {
            dom.classList[exeName](name);
        });
    });
}
export default {
    addClass: function (className) {
        changeClass(getDomList(this), className, 'add');
        return this;
    },

    removeClass: function (className) {
        changeClass(getDomList(this), className, 'remove');
        return this;
    },

    // todo baukh@20200326: 该功能在表格中未使用到
    // toggleClass: function (className) {
    //     changeClass(getDomList(this), className, 'toggle');
    // },

    // 不支持多 className
    hasClass: function (className) {
        return [].some.call(getDomList(this), function (dom) {
            return dom.classList.contains(className);
        });
    }
};

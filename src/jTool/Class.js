import { each } from './utils';
export default {
    addClass: function (className) {
        return this.changeClass(className, 'add');
    },

    removeClass: function (className) {
        return this.changeClass(className, 'remove');
    },

    toggleClass: function (className) {
        return this.changeClass(className, 'toggle');
    },

    // 不支持多 className
    hasClass: function (className) {
        return [].some.call(this.DOMList, function (dom) {
            return dom.classList.contains(className);
        });
    },

    // 解析className 将以空格间格的字符串分割为数组
    parseClassName: function (className) {
        return className.indexOf(' ') ?  className.split(' ') : [className];
    },

    // 执行指定classList方法
    changeClass: function (className, exeName) {
        const classNameList = this.parseClassName(className);
        each(this.DOMList, (i, dom) => {
            each(classNameList, (index, name) => {
                dom.classList[exeName](name);
            });
        });
        return this;
    }
};

import { each, getDomList } from './utils';

/**
 * 解析className 将以空格间格的字符串分割为数组
 * @param className
 * @returns {*}
 */
function parseClassName(className: string): Array<string> {
    // 第一个空格不处理，所以indexOf的值为0也算做一个className
    return className.indexOf(' ') ?  className.split(' ') : [className];
}

/**
 * 执行指定classList方法
 * @param DOMList
 * @param className
 * @param exeName: 执行方法名
 * @returns {changeClass}
 */
function changeClass(DOMList: Array<HTMLElement>, className: string, exeName: string): void {
    const classNameList = parseClassName(className);
    each(DOMList, (dom: HTMLElement) => {
        each(classNameList, (name: string) => {
            dom.classList[exeName](name);
        });
    });
}
export default {
    addClass: function (className: string): unknown {
        changeClass(getDomList(this), className, 'add');
        return this;
    },

    removeClass: function (className: string): unknown {
        changeClass(getDomList(this), className, 'remove');
        return this;
    },

    // 不支持多 className
    hasClass: function (className: string): boolean {
        return [].some.call(getDomList(this), function (dom: HTMLElement) {
            return dom.classList.contains(className);
        });
    }
};

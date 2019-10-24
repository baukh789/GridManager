/**
 * 解析html模板, 该方法为装饰器方法
 * @param tpl
 * @returns {Function}
 */
/* 仅在该文件内使用 new Function */
/* eslint no-new-func: "off"*/
export const parseTpl = tpl => {
    return (target, key, descriptor) => {
        const oldValue = descriptor.value;
        // params 中如果存在 tpl 则使用 params 中的进行渲染
        descriptor.value = params => {
            const vm = oldValue.call(target, params);

            let str = params && params.tpl || tpl;

            return str.replace(/\{\{([^(\}\})]+)\}\}/g, (match, evalStr) => {
                return new Function('vm', 'return ' + evalStr)(vm) || '';
            });
        };
    };
};

/**
 * 解析html模板
 * @param tpl
 * @returns {Function}
 */
export function parseTpl(tpl) {
    return (target, key, descriptor) => {
        const oldValue = descriptor.value;
        // params 中如果存在 tpl 则使用 params 中的进行渲染
        descriptor.value = params => {
            const vm = oldValue.call(target, params);
            return (params && params.tpl || tpl).trim().replace(/\{\{([^(\}\})]+)\}\}/g, (match, evalStr) => {
                if (/return/.test(evalStr)) {
                    return new Function('vm', evalStr)(vm) || '';
                }
                return new Function('vm', 'return ' + evalStr)(vm) || '';
            });
        };
    }
}

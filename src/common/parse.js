/**
 * 解析html模板
 * @param option
 * @returns {Function}
 */
export function parseTpl(option) {
    return (target, key, descriptor) => {
        const oldValue = descriptor.value;
        descriptor.value = object => {
            // vm 用于解析 模板
            const vm = object;

            return oldValue().replace(/\{\{([^(\}\})]+)\}\}/g, (match, evalStr) => {
                if (/return/.test(evalStr)) {
                    return new Function('vm', evalStr)(vm) || '';
                }
                return new Function('vm', 'return ' + evalStr)(vm) || '';
            });
        };
    }
}

/**
 * 解析html模板
 * @param option
 * @returns {Function}
 */
export function parseTpl(option) {

    return (target, key, descriptor) => {
        const oldValue = descriptor.value;
        descriptor.value = (object) => {
            // parseData 用于解析 模板
            const parseData = object;
            return oldValue(parseData).replace(/\{{([^}}]+)}}/g, (match, key) => {
                return new Function('parseData', 'return ' + key)(parseData);
            });
        };
    }
}

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
            return eval('`' + oldValue(parseData) + '`');

            // TODO eval需要替换
            // return oldValue(object).replace(/\${([^}]+)}/g, (match, key) => {
            //     // 解析三目表达式, 仅支持单层形式
            //     if (/\?/.test(key)) {
            //         const split1 = key.split('?');
            //         const split2 = split1[1].split(':');
            //         const expression = split1[0].trim();
            //         const sentence1 = split2[0].trim().replace(/^[\'\"]/g, '').replace(/[\'\"]$/g, '');
            //         const sentence2 = split2[1].trim().replace(/^[\'\"]/g, '').replace(/[\'\"]$/g, '');
            //
            //         return `${object[expression] ? sentence1 : sentence2}`;
            //     }
            //     return object[key];
            // });
        };
    }
}

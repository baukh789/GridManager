/**
 * 清除tmp.html文件中的空格、换行符、注释
 * 清除以 > 开头或以 < 结尾的匹配空字符，如: <tr> {{vm.thListTpl}}  </tr>
 * 标签内的属性空字符不清除，如: <thead {{vm.tableHeadKey}}>
 * 清除标签间的空格，要清除的原因是jTool会将这个空格当作一个text node插入dom，从而导致在使用jTool时出错。如index()方法。
 * @param source
 * @returns {string}
 */
module.exports = function (source) {
    return source.trim()
        // 清除注释
        .replace(/<!--.*?-->/g, '')

        // 清除换行符
        .replace(/\\n/g, '')

        // 清除多余空字符
        .replace(/(\S)(\s)+(\S)/g, (match, p1, p2, p3) => {
            // 清除以 > 开头或以 < 结尾的匹配空字符，如: <tr> {{vm.thListTpl}}  </tr>
            if (p1 === '>' || p3 === '<') {
                return p1 + p3;
            }

            // 标签内的属性空字符不清除，如: <thead {{vm.tableHeadKey}}>
            return p1 + p2 + p3;
        });
};

/**
 * 在测试文件导入后，打印导入成功信息
 * @param source
 * @returns {string}
 */
module.exports =  function (source) {
    const importLog = `console.info('test file import success: ${this.resourcePath}');\n`;
    return importLog + source;
};

function ParseTplPlugin(options) {
    // 使用配置（options）设置插件实例
}

ParseTplPlugin.prototype.apply = function(compiler) {
    compiler.plugin('run', (compilation, callback) => {
        // 探索每个块（构建后的输出）:
        compilation.chunks.forEach(function(chunk) {

            // 探索块生成的每个资源文件名
            chunk.files.forEach(function(filename) {
                console.log(filename);
                // 得到块生成的每个文件资源的源码
                var source = compilation.assets[filename].source();
            });
        });
    });
};

module.exports = { ParseTplPlugin };

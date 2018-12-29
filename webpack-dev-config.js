const webpack = require('webpack');
const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const genRules = require('./webpack-common.loader');
const { version } = require('./package.json');

// API: http://www.css88.com/doc/webpack2/guides/development/
const config = {
	// map
	//  http://www.css88.com/doc/webpack2/configuration/devtool/
	devtool : 'source-map',

	// 入口文件配置
	context: path.join(__dirname, "src/"),

	// 入口文件配置
	entry: {
		js: './js/index.js'
	},

	// 配置模块如何解析
	resolve:{
		extensions: [".js"] //当requrie的模块找不到时,添加这些后缀
	},

	// 文件导出的配置
	output:{
		// path: '/' ,
		filename: "js/gm.js",
		// publicPath 对于热替换（HMR）是必须的，让webpack知道在哪里载入热更新的模块（chunk）
		publicPath: "/"
	},

	// 以插件形式定制webpack构建过程
	plugins: [
		// 将样式文件 抽取至独立文件内
		new ExtractTextWebpackPlugin({
			filename: 'css/gm.css',
			disable: false,
			allChunks: true
		}),

        // 配置环境变量
        new webpack.DefinePlugin({
            'process.env': {
                VERSION: JSON.stringify(version)
            }
        }),

        // 使用交互式可缩放树形图可视化webpack输出文件的大小
        // https://www.npmjs.com/package/webpack-bundle-analyzer
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            defaultSizes: 'parsed',
            openAnalyzer: false
        })
	],

	// 处理项目中的不同类型的模块
	module: {
		rules: genRules('src', true)
	}
};

module.exports = config;

const path = require('path');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const genRules = require('./webpack-common.loader');
const buildPath = path.join(__dirname, "build");

const config = {

	// 入口文件所在的上下文
	context: path.join(__dirname, "src/"),

	devtool: 'source-map',

	// 入口文件配置
	entry: {
		js: './js/index.js'
	},

	// 配置模块如何解析
	resolve:{
		extensions: [".js"] // 当requrie的模块找不到时,添加这些后缀
	},

	// 文件导出的配置
	output:{
		path: buildPath ,
		filename: "js/GridManager.js"
	},
	// 以插件形式定制webpack构建过程
	plugins: [
		// 将样式文件 抽取至独立文件内
		new ExtractTextWebpackPlugin('/css/GridManager.css'),

		// 将文件传输到构建目录, 这里只有一部分使用此种方式. 其它的在package.json中直接使用shell脚本实现
		new TransferWebpackPlugin([
			{from: __dirname + '/src/demo', to: '/demo'},
			{from: __dirname + '/version', to: '/version'}
		])
	],

	// 处理项目中的不同类型的模块。
	module: {
		rules: genRules('src')
	}
};

module.exports = config;

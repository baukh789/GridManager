const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const genRules = require('./webpack-common.loader');
const buildPath = path.join(__dirname, "build");

// API: http://www.css88.com/doc/webpack2/guides/development/
const config = {

	// 入口文件所在的上下文
	context: path.join(__dirname, "src/"),

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
		filename: "js/gm.js"
	},
	// 以插件形式定制webpack构建过程
	plugins: [
		// 将样式文件 抽取至独立文件内
		new ExtractTextWebpackPlugin({
			// 生成文件的文件名
			filename: 'css/gm.css',

			// 是否禁用插件
			disable: false,

			// 是否向所有额外的 chunk 提取（默认只提取初始加载模块）
			allChunks: true
		}),

		// 将文件复制到构建目录
		// CopyWebpackPlugin-> https://github.com/webpack-contrib/copy-webpack-plugin
		new CopyWebpackPlugin([
			{from: __dirname + '/src/demo', to: 'demo'},
			{from: __dirname + '/version', to: 'version'},
			{from: path.join(__dirname, '/readme'), to: 'readme'},
			{from: path.join(__dirname, '/package.json'), to: '', toType: 'file'},
			{from: path.join(__dirname, '/README.md'), to: '', toType: 'file'}
		]),

		// 使用webpack内置插件压缩js
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			sourceMap: false // 是否生成map文件
		})
	],

	// 处理项目中的不同类型的模块。
	module: {
		rules: genRules('src', false)
	}
};

module.exports = config;

const webpack = require('webpack');
const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const config = {
	// map
	devtool : 'source-map',  // TODO  http://www.css88.com/doc/webpack2/configuration/devtool/

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
		filename: "js/GridManager.js",
		// publicPath 对于热替换（HMR）是必须的，让webpack知道在哪里载入热更新的模块（chunk）
		publicPath: "/"
	},

	// 以插件形式定制webpack构建过程
	plugins: [
		// 将样式文件 抽取至独立文件内
		new ExtractTextWebpackPlugin(__dirname + '/css/GridManager.css')
	],

	// 处理项目中的不同类型的模块
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				enforce: 'pre',
				exclude: /(node_modules|bower_components)/,
				include: path.resolve(__dirname, "src/js")
			},
			{
				test: /\.js?$/,
				loaders: ['babel-loader?{"presets":["es2015"]}'],
				exclude: /(node_modules|bower_components)/,
				include: [path.join(__dirname, 'src')]
			},
			{
				test: /\.(sc|c)ss$/,
				exclude: /(node_modules|bower_components)/,
				include: [path.join(__dirname, 'src')],
				use: ExtractTextWebpackPlugin.extract({
					use: 'css-loader?-minimize!resolve-url-loader!sass-loader'
				})
			},
			{
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=15000&mimetype=application/font-woff&prefix=fonts'
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=15000&mimetype=application/octet-stream&prefix=fonts'
			},
			{
				test: /\.eot(\?#\w+)?$/,
				loader: 'url-loader?limit=15000&mimetype=application/vnd.ms-fontobject&prefix=fonts'
			},
			{
				test: /\.svg(#\w+)?$/,
				loader: 'url-loader?limit=15000&mimetype=image/svg+xml&prefix=fonts'
			}
		]
	}
};

module.exports = config;

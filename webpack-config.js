const webpack = require('webpack');
const path = require('path');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const buildPath = path.join(__dirname, "build");
const config = {
	context: path.join(__dirname, "src/"),
	//入口文件配置
	entry: {
		js: './js/GridManager.js'
	},
	resolve:{
		extensions: [".js"] //当requrie的模块找不到时,添加这些后缀
	},
	//文件导出的配置
	output:{
		path: buildPath ,
		filename: "js/GridManager.js"
	},
	plugins: [
		new ExtractTextWebpackPlugin('/css/GridManager.css'),
		new TransferWebpackPlugin([
			{from: __dirname + '/src/demo', to: '/demo'},
			{from: __dirname + '/version', to: '/version'}
		])
	],
	module: {
		rules: [
			// {
			// 	test: /\.js$/,
			// 	loader: 'eslint-loader',
			// 	enforce: 'pre',
			// 	exclude: /(node_modules|bower_components)/,
			// 	include: path.resolve(__dirname, "src/js")
			// },
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

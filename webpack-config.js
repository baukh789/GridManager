var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname,"build");
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var config = {
	//入口文件配置
	entry:path.resolve(__dirname,'src/js/GridManager.js'),
	resolve:{
		extentions:["","js"]//当requrie的模块找不到时,添加这些后缀
	},
	//文件导出的配置
	output:{
		path:buildPath,
		filename:"GridManager.js"
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			include: /\.min\.js$/,
			// mangle: false,
			minimize: true
		}),
		new TransferWebpackPlugin([
			{from: __dirname + '/src/fonts', to: '/fonts'},
			{from: __dirname + '/src/css', to: '/css'}
		])
	],
	module: {
		preLoaders: [
			{
				test: /\.(js|jsx)$/,
				loader: 'eslint-loader',
				include: [path.resolve(__dirname, "src/app")],
				exclude: /(node_modules|bower_components)/
			}
		],
		loaders: [
			{
				test: /\.js?$/,
				loaders: ['babel?{"presets":["es2015"]}'],
				exclude: /(node_modules|bower_components)/,
				include: [path.join(__dirname, 'src'), path.join(__dirname, 'demo')]
			}
		]
	}
}

module.exports = config;

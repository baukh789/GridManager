/**
 * @author  https://github.com/silence717
 * @date on 2017/12/12
 */
const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = (srcCodeDir, idDev) => {
	return [
		{
			test: /\.js$/,
			loader: 'eslint-loader',
			enforce: 'pre',
			exclude: /(node_modules|bower_components)/,
			include: path.resolve(__dirname, srcCodeDir + "/js")
		},
		{
			test: /\.js?$/,
			loaders: ['babel-loader'],
			exclude: /(node_modules|bower_components)/,
			include: [path.join(__dirname, srcCodeDir)]
		},
		{
			test: /\.less$/,
			exclude: /(node_modules|bower_components)/,
			include: [path.join(__dirname, srcCodeDir + '/css')],
			use: ExtractTextWebpackPlugin.extract({
				use: [{
						loader: 'css-loader',
						options: {
							url: true, // 启用/禁用 url() 处理
							minimize: !idDev, // 启用/禁用 压缩
							sourceMap: false // 启用/禁用 Sourcemaps
						}
					},
					{
						loader: 'resolve-url-loader'
					},
					{
						loader: 'less-loader',
						options: {
							sourceMap: false // 启用/禁用 Sourcemaps
						}
					}]
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
};

var express = require('express');
var app = express();
var path = require('path');
var url = require('url');
var webpack = require('webpack');
var config = require('./webpack-dev-config');
var compiler = webpack(config);

// 是否为开发模式; true: 使用src下的资源, false: 使用build下的资源
var isDev = true;
var target = 'build';
if(isDev){
	target = 'src';
}
app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: false,
	stats: {
		colors: true,
		cached: false
	},
	publicPath: config.output.publicPath
}));

// 配置资源路径
app.use(express.static(target));
app.listen(1987, function (err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('started at http://localhost:1987');
});

var express = require('express');
var app = express();
var webpack = require('webpack');
var webpackConfig = require('./webpack-dev-config');
var compiler = webpack(webpackConfig);

// 是否为开发模式; true: 使用src下的资源, false: 使用build下的资源
var isDev = true;
var target = 'build';
if(isDev){
	target = 'src';
}
// 配置热启动
app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: false,
	stats: {
		colors: true,
		cached: false
	},
	publicPath: webpackConfig.output.publicPath
}));

// 配置空路径
app.use(/\/$/, function (req, res) {
	res.redirect('/demo/index.html');
});

// 配置coverage路径
app.use(/\/coverage$/, function (req, res) {
	res.redirect('/coverage/chart/index.html');
});

// 配置资源路径
app.use(express.static(target));
app.use(express.static(__dirname));
app.listen(1987, function (err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('started at http://localhost:1987');
});

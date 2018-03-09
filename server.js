const path = require('path');
const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackConfig = require('./webpack-dev-config');
const compiler = webpack(webpackConfig);

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

// 配置资源路径√
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(__dirname));
app.listen(2015, function (err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('started at http://localhost:2015');
});

/**
 * karma: 测试管理工具
 * phantomjs: 模拟的浏览器环境
 *
 */
const path = require('path');
module.exports = function (config) {
	config.set({
		// 将用于解决所有的模式基本路径（例如，文件，排除）
		basePath: '',

		// 框架使用
		// 可用的框架：https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],

		// 需要测试的文件列表 https://www.npmjs.com/package/karma-coverage
		// TODO 这里需要看一下
		files: [
			'src/js/*.js',
			'test/Config_test.js'
			// 'test/Adjust_test.js',
			// 'test/AjaxPage_test.js'
		],
		// 排除在外的文件列表
		exclude: ['karma.conf.js'],

		// 使用端口
		port: 9876,

		// 是否在输出日志中使用颜色
		colors: true,

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['PhantomJS'],

		captureTimeout: 60000,

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress', 'coverage'],

		// 预处理
		preprocessors: {
			'src/js/*.js': ['webpack', 'coverage'],
			'test/*_test.js': ['webpack']
		},
		// optionally, configure the reporter
		coverageReporter: {
			reporters: [
				// generates ./coverage/lcov.info
				{type:'lcovonly', subdir: '.'},
				// generates ./coverage/coverage-final.json
				{type:'json', subdir: '.'}
			]
		},

		// webpack config
		webpack: {
			//入口文件配置
			entry: {
				js: './test/index_test.js'
			},
			resolve:{
				extensions: [".js"] //当requrie的模块找不到时,添加这些后缀
			},
			module: {
				rules: [
					// {
					// 	test: /\.js$/,
					// 	loader: 'istanbul-instrumenter-loader',
					// 	enforce: 'pre',
					// 	exclude: /node_modules|_spec\.js$/,
					// 	include: [path.join(__dirname, './src')]
					// },
					{
						test: /\.js?$/,
						use: ['babel-loader?{"presets":["es2015"]}'],
						exclude: /(node_modules|bower_components)/,
						include: [path.join(__dirname, 'src'), path.join(__dirname, 'test')]
					},
					{
						test:/.css$/,
						loader:'style-loader!css-loader'
					},
					{
						test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
						use: 'url-loader?limit=15000&mimetype=application/font-woff&prefix=fonts'
					},
					{
						test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
						use: 'url-loader?limit=15000&mimetype=application/octet-stream&prefix=fonts'
					},
					{
						test: /\.eot(\?#\w+)?$/,
						use: 'url-loader?limit=15000&mimetype=application/vnd.ms-fontobject&prefix=fonts'
					},
					{
						test: /\.svg(#\w+)?$/,
						use: 'url-loader?limit=15000&mimetype=image/svg+xml&prefix=fonts'
					}
				]
			}

		},
		webpackMiddleware: {noInfo: false}, // no webpack output
		concurrency: Infinity
	});
};

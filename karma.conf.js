/**
 * karma: 测试管理工具
 * phantomjs: 模拟的浏览器环境
 *
 */
const webpack = require('webpack');
const path = require('path');
const { version } = require('./package.json');
module.exports = function (config) {
	// karma config: http://karma-runner.github.io/1.0/config/configuration-file.html
	// karma-coverage: https://www.npmjs.com/package/karma-coverage
	// Travis CI: http://www.ruanyifeng.com/blog/2017/12/travis_ci_tutorial.html
	config.set({
		// 将用于解决所有的模式基本路径（例如，文件，排除）
		basePath: '',

		// 使用框架
		// 可用的框架：https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],

		// 需要测试的文件列表
		files: [
            // 'test/*_test.js',
			'test/Adjust_test.js',
			'test/AjaxPage_test.js',
			'test/Base_test.js',
			'test/Cache_test.js',
			'test/Checkbox_test.js',
			'test/Config_test.js',
			'test/Core_test.js',
			'test/Drag_test.js',
			'test/Export_test.js',
			'test/GridManager_test.js',
			'test/Hover_test.js',
			'test/I18n_test.js',
			// 'test/index_test.js',
			// 'test/index_jQuery_test.js',
			'test/Menu_test.js',
			'test/Order_test.js',
			// 'test/Publish_test.js',
			'test/Remind_test.js',
			'test/Scroll_test.js',
			'test/Settings_test.js',
			'test/Sort_test.js',
			'test/Store_test.js'
		],

		// 使用端口
		port: 9876,

		// 是否在输出日志中使用颜色
		colors: true,

		// 持续集成模式: 配置为true 将会持续运行测试, 直致完成返回0(成功)或1(失败). 示例: Done. Your build exited with 0.
		singleRun: true,


		// 日志级别
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// 是否监听文件变化
		autoWatch: true,

		// 配置启动单元测试的环境
		browsers: ['PhantomJS'],

		captureTimeout: 60000,

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress', 'coverage'],

		// 预处理
		preprocessors: {
			// src/js/*.js 在由 test/*_test.js 中调用时就会使用webpack打包, 所以 src/js/*.js 不需要通过 webpack 进行打.
			'src/js/*.js': ['sourcemap', 'coverage'],
			'test/*_test.js': ['webpack']
		},
		// optionally, configure the reporter
		coverageReporter: {
			reporters: [
				// generates ./coverage/chart/*.html
				{ type: 'html', subdir: 'chart' },
				// generates ./coverage/lcov.info
				{type:'lcovonly', subdir: '.'},
				// generates ./coverage/coverage-final.json
				{type:'json', subdir: '.'}
			]
		},

		// webpack config: https://github.com/webpack-contrib/karma-webpack
		webpack: {
			//入口文件配置
			entry: {
				js: './test/index_test.js'
			},
			resolve:{
				extensions: [".js"] //当requrie的模块找不到时,添加这些后缀
			},
			plugins: [
				new webpack.ProvidePlugin({
					'Promise': 'es6-promise'
				}),
                new webpack.DefinePlugin({
                    'process.env': {
                        VERSION: JSON.stringify(version)
                    }
                })
			],
			module: {
				rules: [
					{
						test: /\.js?$/,
						use: ['babel-loader'],
						exclude: /(node_modules|bower_components)/,
						include: [path.join(__dirname, 'src'), path.join(__dirname, 'test')]
					},
					{
						test:/.less/,
						loader:'css-loader!less-loader'
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

		// Karma有多少个浏览器并行启动
		concurrency: Infinity
	});
};

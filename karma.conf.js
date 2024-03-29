/**
 * karma: 测试管理工具
 * phantomjs: 模拟的浏览器环境
 *
 */
const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
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
		frameworks: ['jasmine-ajax', 'jasmine', 'webpack'],

		// 需要测试的文件列表
		files: [
            { pattern: 'test/**/*_test.js' }
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
		autoWatch: false,

        // 配置启动单元测试的环境
		browsers: ['ChromeHeadless'],

        // 捕获浏览器的超时时间
		captureTimeout: 60000,

        // coverage reporter generates the coverage
		reporters: ['progress', 'coverage'],

		// 预处理
		preprocessors: {
			'src/**/*.js': ['coverage', 'webpack', 'sourcemap'],
			'test/**/*_test.js': ['webpack']
		},
		// optionally, configure the reporter
		coverageReporter: {
			reporters: [
				// generates ./coverage/chart/*.html
				{ type: 'html', subdir: 'chart' },
				// generates ./coverage/lcov.info
				{type: 'lcovonly', subdir: '.'},
				// generates ./coverage/coverage-final.json
				{type: 'json', subdir: '.'}
			]
		},

		// webpack config: https://github.com/webpack-contrib/karma-webpack
		webpack: {
            mode: 'development',
            optimization: {
                runtimeChunk: false,
                splitChunks: false
            },
			// 入口文件配置
			resolve: {
				extensions: ['.js', '.ts'], // 当requrie的模块找不到时,添加这些后缀
                alias: {
                    '@common': path.join(__dirname, './src/common'),
                    '@jTool': path.join(__dirname, './src/jTool'),
                    '@module': path.join(__dirname, './src/module'),
                    '@test': path.join(__dirname, './test'),
                    '@package.json': path.join(__dirname, './package.json')
                }
			},
            // output: {
            //     filename: '[name].js',
            //     path: path.join(__dirname, '_karma_webpack_') + Math.floor(Math.random() * 1000000),
            // },
			plugins: [
                new CleanWebpackPlugin({
                    cleanOnceBeforeBuildPatterns: [path.join(__dirname, './coverage')]
                }),
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
                        test: /_test.js?$/,
                        use: [{
                            loader: path.join(__dirname, './webpack-loaders/karma-log-loader.js')
                        }]
                    },
                    {
                        test: /\.tsx?$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: 'babel-loader'
                            },
                            {
                                loader: 'ts-loader'
                            }
                        ]
                    },
					{
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: ['babel-loader']
					},
                    {
                        test: /\.less/,
                        include: [path.join(__dirname, 'src')],
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    url: true, // 启用/禁用 url() 处理
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
                            }
                        ]
                    }, {
                        test: /\.html$/,
                        use: [path.join(__dirname, './webpack-loaders/html-clear-loader.js'), 'html-loader'],
                        include: [path.join(__dirname, 'src'), path.join(__dirname, 'test')],
                        exclude: /(node_modules|bower_components)/
                    }, {
                        test: /\.(jpe?g|png|gif|svg)$/i,
                        use: [
                            {
                                loader: 'file-loader?name=[path][name]-[hash:5].[ext]'
                            }
                        ]
                    }, {
                        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                        use: [
                            {
                                loader: 'url-loader',
                                options: {
                                    limit: 10000,
                                    mimetype: 'application/font-woff'
                                }
                            }
                        ]
                    }, {
                        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                        use: [
                            {
                                loader: 'url-loader',
                                options: {
                                    limit: 10000,
                                    mimetype: 'application/octet-stream'
                                }
                            }
                        ]
                    }, {
                        test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
                        use: [
                            {
                                loader: 'url-loader',
                                options: {
                                    limit: 10000,
                                    mimetype: 'application/font-otf'
                                }
                            }
                        ]
                    }, {
                        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                        use: [
                            {
                                loader: 'file-loader'
                            }
                        ]
                    }, {
                        test: /\.(jpe?g|png|gif|svg)$/i,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[path][name]-[hash:8].[ext]'
                                }
                            }
                        ]
                    }
				]
			}
		},

		// webpackMiddleware: {noInfo: false}, // no webpack output

		// Karma有多少个浏览器并行启动
		concurrency: Infinity,
        processKillTimeout: 1000
	});
};

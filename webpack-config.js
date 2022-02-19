const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const getRules = require('./webpack-common.loader');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { name, version } = require('./package.json');
const buildPath = path.join(__dirname, './dist');

const srcDir = path.join(__dirname, './src');
const resolve = dir => path.resolve(__dirname, dir);

const config = {
    mode: 'production',

	// 入口文件所在的上下文
	context: srcDir,

	// 入口文件配置
	entry: {
        gm: './module/index.js',
        'gm-react': './framework/react/js/index.js',
        'gm-vue': './framework/vue2/js/index.js' // 目前将vue2定为默认的版本，后续增加vue3后需要更名为gm-vue2
	},

	// 配置模块如何解析
	resolve: {
        extensions: ['.js', '.ts'], // 当requrie的模块找不到时,添加这些后缀
        alias: {
            '@common': resolve('src/common'),
            '@jTool': resolve('src/jTool'),
            '@module': resolve('src/module')
        }
	},

	// 文件导出的配置
	output: {
		path: buildPath,
		filename: 'js/[name].js',

        // 通过script标签引入时，由index.js中设置的window.GridManager将被覆盖为{default: {..gm object}}。原因是通过library设置所返回的值为{default: {..gm object}}
        // library: 'GridManager', // 引入后可以通过全局变量GridManager来使用

        // 允许与CommonJS，AMD和全局变量一起使用。
        // 如: `import gridManager from 'gridmanager';` `const gridManager = require('gridmanager').default;`
        libraryTarget: 'umd'
	},

	externals: ['react', 'react-dom', 'vue'],

    // 优化代码
    optimization: {
        minimize: true,
        minimizer: [
            // 压缩js
            new TerserPlugin({
                // cache: true,
                parallel: true,
                // sourceMap: false,
                terserOptions: {
                    warnings: false,
                    ie8: false,
                    output: {
                        comments: false
                    }
                }
            }),

            // 压缩css
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {
                    discardComments: {removeAll: true},
                    minifyGradients: true
                },
                canPrint: true
            })
        ]
    },

	// 以插件形式定制webpack构建过程
	plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [resolve('./dist')]
        }),
        // 将样式文件 抽取至独立文件内
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: '[id].css'
        }),

        // 将文件复制到构建目录
		// CopyWebpackPlugin-> https://github.com/webpack-contrib/copy-webpack-plugin
		new CopyWebpackPlugin({
            patterns: [
                {from: __dirname + '/src/demo/', to: 'demo/', toType: 'dir'},
                {from: path.join(__dirname, '/package.json'), to: './'},
                {from: path.join(__dirname, '/README.md'), to: './'}
            ]
        }),

        // 配置环境变量
        new webpack.DefinePlugin({
            'process.env': {
                VERSION: JSON.stringify(version)
            }
        }),

        // 构建带版本号的zip包
        new FileManagerPlugin({
            onStart: {
                delete: [
                    './zip'
                ]
            },
            onEnd: {
                mkdir: ['./zip', './tempzip'],
                copy: [{
                    source: './dist/**/*.{html,css,js}',
                    destination: `./tempzip/${name}-${version}/`
                }],
                archive: [
                    {source: `./tempzip/${name}-${version}`, destination: `./zip/${name}-${version}.zip`}
                ],
                delete: [
                    './tempzip',
                    './dist/demo' // 防止将demo传至npm
                ]
            }
        })
	],

	// 处理项目中的不同类型的模块。
	module: {
        rules: getRules()
	}
};

module.exports = config;

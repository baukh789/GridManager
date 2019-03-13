const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
    return [
        {
        	enforce: 'pre',
        	test: /\.js$/,
        	include: [path.join(__dirname, 'src')],
        	exclude: /node_modules/,
        	use: [
        		{
        			loader: 'eslint-loader',
        			options: {
        				formatter: require('eslint-friendly-formatter')
        			}
        		}
        	]
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['babel-loader']
        },
        {
            test: /\.(le|c)ss/,
            include: [path.join(__dirname, 'src')],
            use: [
                {
                    loader: MiniCssExtractPlugin.loader
                },
                {
                    loader: 'css-loader',
                    options: {
                        url: true, // 启用/禁用 url() 处理
                        sourceMap: true // 启用/禁用 Sourcemaps
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
            use: ['html-loader'],
            include: [path.join(__dirname, 'src')],
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
                        mimetype: "application/font-woff"
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
                        mimetype: "application/octet-stream"
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
                        mimetype: "application/font-otf"
                    }
                }
            ]
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            use: [
                {
                    loader:"file-loader"
                }
            ]
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name]-[hash:8].[ext]',
                    }
                }
            ]
        }
    ];
};

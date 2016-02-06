/* eslint-env node */
'use strict';
module.exports = {
    entry: './src/js/main.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    debug: true,
    devtoop: 'cheap-inline-source-map',
    module: {
        loaders: [{
            test: /\.js/,
            exclude: /(?:node_modules|bower_components)/,
            loader: 'babel-loader'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.styl$/,
            loader: 'style-loader!css-loader!stylus-loader'
        }, {
            test: /\.(?:woff)|(?:eot)|(?:ttf)|(?:svg)$/,
            loader: 'url',
            query: {
                limit: 100000
            }
        }]
    },
    resolve: {
        extensions: ['', '.js', '.json']
    }
};


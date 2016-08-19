var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: ["./src/js/main.js"],
    debug: true,
    devtool: 'cheap-module-inline-source-map',
    output: {
        path: __dirname + "/dist",
        //publicPath: "/assets/",
        filename: "bundle.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Comfort zone',
            template: 'src/index.html',
            inject: 'body'
        }),
    ],
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style!css'
        }, {
            test: /\.styl$/,
            loader: 'style!css!stylus'
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=10000&minetype=application/font-woff"
        }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader"
        }, {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: "babel"
        }]
    }
};


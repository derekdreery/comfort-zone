import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from 'webpack';

export default function config(debug) {
  // booleanify
  debug = debug === true;
  let config = {
    entry: ["./src/js/main.js"],
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
        loaders: debug ?
          ['react-hot', 'babel-loader?cacheDirectory&stage=0'] :
          ['babel-loader?cacheDirectory&stage=0']
      }]
    }
  };

  if(debug) {
    config.devtool = 'cheap-module-eval-source-map';
    config.cache = true;
    config.debug = true;
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    );
    config.entry.push("webpack/hot/dev-server");
  } else {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
      minimize: true
    }));
  }

  return config;
}

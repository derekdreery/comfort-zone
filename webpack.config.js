import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from 'webpack';

const config = {
  cache: true,
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  entry: ["./src/js/main.js", "webpack/hot/dev-server"],
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
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
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
      loaders: ['react-hot', 'babel-loader?cacheDirectory&stage=0']
    }]
  }
}

export default config;

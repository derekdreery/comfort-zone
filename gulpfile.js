const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfigFactory = require('./webpack.config.js');

const prod = gutil.env.production;
const webpackConfig = webpackConfigFactory(!prod);
const paths = {
  js: {
    src: 'src/js',
    dest: 'build/js'
  }
};

gulp.task('webpack', function(callback) {
  // run webpack
  webpack(webpackConfig, function(err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      // output options
    }));
    callback();
  });
});

gulp.task('webpack-dev-server', function(callback) {
  // Start a webpack-dev-server
  var compiler = webpack(webpackConfig, function(err, stats) {
    if(err) {
      throw new gutil.PluginError('webpack', err);
    }
    gutil.log('[webpack]', stats.toString());
  });

  new WebpackDevServer(compiler, {
    // server and middleware options
    contentBase: __dirname + '/dist',
    hot: true,
    quiet: false,
    stats: {
      assets: true,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }
  }).listen(8080, '0.0.0.0', function(err) {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);
    // Server listening
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');

    // keep the server alive or continue?
    // callback();
  });
});

const task = prod ? 'webpack' : 'webpack-dev-server';
gulp.task('default', [task], () => {});

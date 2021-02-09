const NotifyBcApplication = require('../dist/application').NotifyBcApplication;
const webpack = require('webpack');
const app = new NotifyBcApplication();

module.exports = {
  transpileDependencies: ['vuetify'],
  pages: {
    index: {
      entry: 'src/main.js',
      apiUrlPrefix: app.options.restApiRoot,
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      }),
    ],
  },
  devServer: {
    proxy: {
      '^/api/': {
        target: 'http://localhost:3000',
      },
    },
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugin('html-index').tap(args => {
        args[0].template = '!!html-loader?minimize=false!' + args[0].template;
        args[0].minify = false;
        return args;
      });
    }
  },
};

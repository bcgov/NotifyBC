const webpack = require('webpack');
module.exports = {
  transpileDependencies: ['vuetify'],
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'NotifyBC Web Console',
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
};

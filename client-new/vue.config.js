const webpack = require('webpack');
module.exports = {
  transpileDependencies: ['vuetify'],
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

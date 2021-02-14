const NotifyBcApplication = require('../dist/application').NotifyBcApplication;
const webpack = require('webpack');
const app = new NotifyBcApplication();

module.exports = {
  transpileDependencies: ['vuetify'],
  pages: {
    index: {
      entry: 'src/main.js',
      apiUrlPrefix: app.options.restApiRoot,
      oidcAuthority: app.options.oidc && app.options.oidc.discoveryUrl,
      oidcClientId: app.options.oidc && app.options.oidc.clientId,
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
    port: 8000,
    proxy: {
      '^/api/': {
        target: 'http://localhost:3000',
      },
      '^/oauth2-redirect.html': {
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

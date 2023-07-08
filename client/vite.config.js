// Plugins
import vue from '@vitejs/plugin-vue';
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify';
// Utilities
import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import fs from 'fs';
import {globSync} from 'fast-glob';
import ejs from 'ejs';

const NotifyBcApplication = require('../dist/application').NotifyBcApplication;
const app = new NotifyBcApplication();
const proxyProto = app.options.tls.enabled ? 'https' : 'http';

export default ({mode}) => {
  let config = {
    plugins: [
      vue({
        template: {transformAssetUrls},
      }),
      // glob inject css
      {
        load(id) {
          if (id.endsWith('.vue')) {
            const source = fs
              .readFileSync(id)
              .toString()
              .replace(/inject-css:\s*'([^']+)';/g, replace => {
                const pattern = replace.match(/'([^']+)/)[1];
                return globSync(pattern, {absolute: true})
                  .map(file => fs.readFileSync(file))
                  .join('\n');
              });
            return source;
          }
        },
      },
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
      vuetify({
        autoImport: true,
      }),
    ],
    define: {
      'process.env': {},
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },
    server: {
      port: 8000,
      open: '/',
      proxy: {
        '^/api/': {
          target: proxyProto + '://127.0.0.1:3000',
          changeOrigin: true,
        },
        '^/oauth2-redirect.html': {
          target: proxyProto + '://127.0.0.1:3000',
        },
      },
    },
  };

  if (mode === 'development') {
    const htmlPlugin = () => {
      return {
        name: 'html-transform',
        transformIndexHtml(html) {
          return ejs.render(html, {
            apiUrlPrefix: app.options.restApiRoot,
            oidcAuthority: app.options.oidc && app.options.oidc.discoveryUrl,
            oidcClientId: app.options.oidc && app.options.oidc.clientId,
          });
        },
      };
    };
    config.plugins.push(htmlPlugin());
  }
  return defineConfig(config);
};

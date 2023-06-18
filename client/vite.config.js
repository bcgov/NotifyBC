// Plugins
import vue from '@vitejs/plugin-vue';
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify';
// Utilities
import inject from '@rollup/plugin-inject';
import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';

const NotifyBcApplication = require('../dist/application').NotifyBcApplication;
const app = new NotifyBcApplication();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {transformAssetUrls},
    }),
    inject({
      // => that should be first under plugins array
      $: 'jquery',
      jQuery: 'jquery',
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
  ],
  define: {
    'process.env': {},
    apiUrlPrefix: JSON.stringify(app.options.restApiRoot),
    oidcAuthority: JSON.stringify(
      app.options.oidc && app.options.oidc.discoveryUrl,
    ),
    oidcClientId: JSON.stringify(app.options.oidc && app.options.oidc.clientId),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  server: {
    port: 8000,
    https: app.options.tls.enabled,
  },
});

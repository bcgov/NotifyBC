// Plugins
import vue from '@vitejs/plugin-vue';
import ViteFonts from 'unplugin-fonts/vite';
import Components from 'unplugin-vue-components/vite';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// Utilities
import { NestFactory } from '@nestjs/core';
import inject from '@rollup/plugin-inject';
import ejs from 'ejs';
import { globSync } from 'fast-glob';
import fs from 'fs';
import { fileURLToPath, URL } from 'node:url';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';
import { DynamicPublicDirectory } from 'vite-multiple-assets';
import { AppConfigService } from '../dist/config/app-config.service';
import { ConfigModule } from '../dist/config/config.module';

export default async ({ mode }) => {
  const app = await NestFactory.create(ConfigModule);
  const appConfig = app.get(AppConfigService).get();
  const proxyProto = appConfig.tls.enabled ? 'https' : 'http';

  let config = {
    plugins: [
      VueRouter(),
      vue({
        template: { transformAssetUrls },
      }),
      // glob inject css
      {
        load(id) {
          if (id.endsWith('.vue')) {
            const source = fs
              .readFileSync(id)
              .toString()
              .replace(/inject-css:\s*'([^']+)';/g, (replace) => {
                const pattern = replace.match(/'([^']+)/)[1];
                return globSync(pattern, { absolute: true })
                  .map((file) => fs.readFileSync(file))
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
      Components(),
      ViteFonts({
        google: {
          families: [
            {
              name: 'Roboto',
              styles: 'wght@100;300;400;500;700;900',
            },
          ],
        },
      }),
      DynamicPublicDirectory(['node_modules/iframe-resizer/js']),
      inject({
        jQuery: 'jquery',
        $: 'jquery',
        include: [],
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
            apiUrlPrefix: appConfig.restApiRoot,
            oidcAuthority: appConfig.oidc?.discoveryUrl?.split(
              /\/\.well-known\/openid-configuration$/,
            )[0],
            oidcClientId: appConfig.oidc && appConfig.oidc.clientId,
          });
        },
      };
    };
    config.plugins.push(htmlPlugin());
  }
  await app.close();
  return defineConfig(config);
};

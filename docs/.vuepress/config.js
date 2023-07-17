import packageJson, {description} from '../../package';
import {defineUserConfig, defaultTheme} from 'vuepress';
import {getDirname, path} from '@vuepress/utils';
import {docsearchPlugin} from '@vuepress/plugin-docsearch';
import {themeDataPlugin} from '@vuepress/plugin-theme-data';

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: `/NotifyBC${process.env.notifyBCDocVersion_PATH || '/'}`,
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'NotifyBC',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', {name: 'theme-color', content: '#3eaf7c'}],
    ['meta', {name: 'apple-mobile-web-app-capable', content: 'yes'}],
    ['meta', {name: 'apple-mobile-web-app-status-bar-style', content: 'black'}],
    ['link', {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
      },
    ],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  alias: {
    '@theme/NavbarBrand.vue': path.resolve(
      __dirname,
      './components/myNavbarBrand.vue',
    ),
    '@theme/HomeFeatures.vue': path.resolve(
      __dirname,
      './components/myHomeFeatures.vue',
    ),
  },
  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    docsearchPlugin({
      apiKey: process.env.ALGOLIA_API_Key,
      appId: process.env.ALGOLIA_APP_ID,
      indexName: 'notifybc',
    }),
    themeDataPlugin({
      themeData: {
        repo: packageJson.repository.url,
        logo: '/img/logo.svg',
        docsDir: '',
        editLink: false,
        contributors: false,
        lastUpdated: false,
        navbar: [
          {
            text: 'Home',
            link: '/',
          },
          {
            text: 'Docs',
            link: '/docs/',
          },
          {
            text: 'Help',
            link: '/help/',
          },
        ],
        sidebar: {
          '/docs/': [
            {
              title: 'Getting Started',
              collapsable: false,
              children: [
                'getting-started/',
                'getting-started/overview',
                'getting-started/quickstart',
                'getting-started/installation',
                'getting-started/web-console',
                "getting-started/what's-new",
              ],
            },
            {
              title: 'Configuration',
              collapsable: false,
              children: [
                'config/overview',
                'config/database',
                'config/adminIpList',
                'config/reverseProxyIpLists',
                'config/httpHost',
                'config/internalHttpHost',
                'config/email',
                'config/sms',
                'config/subscription',
                'config/notification',
                'config/nodeRoles',
                'config/cronJobs',
                'config/rsaKeys',
                'config/workerProcessCount',
                'config/middleware',
                'config/oidc',
                'config/certificates',
              ],
            },
            {
              title: 'API',
              collapsable: false,
              children: [
                'api/overview',
                'api/subscription',
                'api/notification',
                'api/config',
                'api/administrator',
                'api/bounce',
              ],
            },
            {
              title: 'Miscellaneous',
              collapsable: false,
              children: [
                'miscellaneous/benchmarks',
                'miscellaneous/bulk-import',
                'miscellaneous/developer-notes',
                'miscellaneous/upgrade',
              ],
            },
            {
              title: 'Meta',
              collapsable: false,
              children: ['meta/conduct', 'meta/acknowledgments'],
            },
          ],
        },
        algolia: {
          apiKey: process.env.ALGOLIA_API_Key,
          indexName: 'notifybc',
        },
      },
    }),
  ],
});

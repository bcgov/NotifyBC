import packageJson, {description} from '../../package';
import {defineUserConfig, defaultTheme} from 'vuepress';
import {getDirname, path} from '@vuepress/utils';
import {docsearchPlugin} from '@vuepress/plugin-docsearch';
import codeCopyPlugin from '@snippetors/vuepress-plugin-code-copy';

const __dirname = getDirname(import.meta.url);

const base = `/NotifyBC${process.env.notifyBCDocVersion_PATH || '/'}`;
export default defineUserConfig({
  base,
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
    ['link', {rel: 'icon', type: 'image/x-icon', href: `${base}favicon.ico`}],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
      },
    ],
  ],

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
      apiKey: process.env.ALGOLIA_API_KEY,
      appId: process.env.ALGOLIA_APP_ID,
      indexName: 'notifybc',
      indexBase: '/NotifyBC/',
    }),
    codeCopyPlugin(),
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  theme: defaultTheme({
    repo: packageJson.repository.url,
    packageJson,
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
    sidebarDepth: 1,
    sidebar: [
      {
        text: 'Getting Started',
        children: [
          '/docs/',
          '/docs/overview/',
          '/docs/quickstart/',
          '/docs/installation/',
          '/docs/web-console/',
          "/docs/what's-new/",
        ],
      },
      {
        text: 'Configuration',
        children: [
          '/docs/config-overview/',
          '/docs/config-database/',
          '/docs/config-adminIpList/',
          '/docs/config-reverseProxyIpLists/',
          '/docs/config-httpHost/',
          '/docs/config-internalHttpHost/',
          '/docs/config-email/',
          '/docs/config-sms/',
          '/docs/config-subscription/',
          '/docs/config-notification/',
          '/docs/config-nodeRoles/',
          '/docs/config-cronJobs/',
          '/docs/config-rsaKeys/',
          '/docs/config-workerProcessCount/',
          '/docs/config-middleware/',
          '/docs/config-oidc/',
          '/docs/config-certificates/',
        ],
      },
      {
        text: 'API',
        collapsed: false,
        children: [
          '/docs/api-overview/',
          '/docs/api-subscription/',
          '/docs/api-notification/',
          '/docs/api-config/',
          '/docs/api-administrator/',
          '/docs/api-bounce/',
        ],
      },
      {
        text: 'Miscellaneous',
        children: [
          '/docs/benchmarks/',
          '/docs/bulk-import/',
          '/docs/developer-notes/',
          '/docs/upgrade/',
        ],
      },
      {
        text: 'Meta',
        children: ['/docs/conduct/', '/docs/acknowledgments/'],
      },
    ],
  }),
});

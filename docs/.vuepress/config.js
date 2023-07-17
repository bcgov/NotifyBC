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
        sidebarDepth: 1,
        sidebar: [
          {
            text: 'Getting Started',
            children: [
              {text: 'Welcome', link: '/docs/'},
              {text: 'Overview', link: '/docs/overview/'},
              {text: 'Quick Start', link: '/docs/quickstart/'},
              {text: 'Installation', link: '/docs/installation/'},
              {text: 'Web Console', link: '/docs/web-console/'},
              // "getting-started/whats-new",
            ],
          },
          {
            text: 'Configuration',
            children: [
              {text: 'Configuration Overview', link: '/docs/config-overview/'},
              {text: 'Database', link: '/docs/config-database/'},
              {text: 'Admin IP List', link: '/docs/config-adminIpList/'},
              {
                text: 'Reverse Proxy IP Lists',
                link: '/docs/config-reverseProxyIpLists/',
              },
              {
                text: 'HTTP Host',
                link: '/docs/config-httpHost/',
              },
              {
                text: 'Internal HTTP Host',
                link: '/docs/config-internalHttpHost/',
              },
              {
                text: 'Email',
                link: '/docs/config-email/',
              },
              {
                text: 'SMS',
                link: '/docs/config-sms/',
              },
              {
                text: 'Subscription',
                link: '/docs/config-subscription/',
              },
              {
                text: 'Notification',
                link: '/docs/config-notification/',
              },
              {
                text: 'Node Roles',
                link: '/docs/config-nodeRoles/',
              },
              {
                text: 'Cron Jobs',
                link: '/docs/config-cronJobs/',
              },
              {
                text: 'RSA Keys',
                link: '/docs/config-rsaKeys/',
              },
              {
                text: 'Worker Process Count',
                link: '/docs/config-workerProcessCount/',
              },
              {
                text: 'Middleware',
                link: '/docs/config-middleware/',
              },
              {
                text: 'OIDC',
                link: '/docs/config-oidc/',
              },
              {
                text: 'TLS Certificates',
                link: '/docs/config-certificates/',
              },
            ],
          },
          {
            text: 'API',
            collapsed: false,
            children: [
              {
                text: 'API Overview',
                link: '/docs/api-overview/',
              },
              {
                text: 'Subscription',
                link: '/docs/api-subscription/',
              },
              {
                text: 'Notification',
                link: '/docs/api-notification/',
              },
              {
                text: 'Configuration',
                link: '/docs/api-config/',
              },
              {
                text: 'Administrator',
                link: '/docs/api-administrator/',
              },
              {
                text: 'Bounce',
                link: '/docs/api-bounce/',
              },
            ],
          },
          {
            text: 'Miscellaneous',
            children: [
              {
                text: 'Benchmarks',
                link: '/docs/benchmarks/',
              },
              {
                text: 'Developer Notes',
                link: '/docs/developer-notes/',
              },
              {
                text: 'Upgrade Guide',
                link: '/docs/upgrade/',
              },
            ],
          },
          {
            text: 'Meta',
            children: [
              {
                text: 'Code of Conduct',
                link: '/docs/conduct/',
              },
              {
                text: 'Acknowledgments',
                link: '/docs/acknowledgments/',
              },
            ],
          },
        ],
        algolia: {
          apiKey: process.env.ALGOLIA_API_Key,
          indexName: 'notifybc',
        },
      },
    }),
  ],
});

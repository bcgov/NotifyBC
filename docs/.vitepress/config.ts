import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitepress';
const {description} = require('../package');

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: `/NotifyBC${process.env.notifyBCDocVersion_PATH || '/'}`,
  title: 'NotifyBC',
  description: description,
  themeConfig: {
    logo: '/img/logo.svg',
    repo: 'bcgov/NotifyBC',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {
        text: 'Docs',
        link: '/docs/',
      },
      {text: 'Help', link: '/help/'},
    ],

    sidebar: {
      '/docs/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            {text: 'Welcome', link: 'docs/'},
            {text: 'Overview', link: 'docs/getting-started/overview'},
            {text: 'Quick Start', link: 'docs/getting-started/quickstart'},
            // 'getting-started/installation',
            // 'getting-started/web-console',
            // "getting-started/whats-new",
          ],
        },
        /*
        {
          text: 'Configuration',
          collapsed: false,
          items: [
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
          text: 'API',
          collapsed: false,
          items: [
            'api/overview',
            'api/subscription',
            'api/notification',
            'api/config',
            'api/administrator',
            'api/bounce',
          ],
        },
        {
          text: 'Miscellaneous',
          collapsed: false,
          items: [
            'miscellaneous/benchmarks',
            'miscellaneous/bulk-import',
            'miscellaneous/developer-notes',
            'miscellaneous/upgrade',
          ],
        },
        {
          text: 'Meta',
          collapsed: false,
          items: ['meta/conduct', 'meta/acknowledgments'],
        },
        */
      ],
    },

    socialLinks: [{icon: 'github', link: 'https://github.com/vuejs/vitepress'}],
    externalLinkIcon: true,
  },
  rewrites: {
    'docs/getting-started/index.md': 'docs/index.md',
  },
  cleanUrls: true,
  ignoreDeadLinks: true,
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPNavBarTitle\.vue$/,
          replacement: fileURLToPath(
            new URL('./components/NavBarTitle.vue', import.meta.url),
          ),
        },
      ],
    },
    server: {
      port: 8080,
    },
  },
});

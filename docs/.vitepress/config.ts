import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitepress';
import packageJson, {description, repository} from '../../package.json';

const repo = repository.url.substring(19);
// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: `/NotifyBC${process.env.notifyBCDocVersion_PATH || '/'}`,
  title: 'NotifyBC',
  description: description,
  themeConfig: {
    package: packageJson,
    logo: '/img/logo.svg',
    repo: repo,
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {
        text: 'Docs',
        link: '/docs/',
      },
      {text: 'Help', link: '/help/'},
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
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
        items: [
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
        items: [
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
        items: [
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
        items: [
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

    socialLinks: [{icon: 'github', link: `https://github.com/${repo}`}],
    externalLinkIcon: true,
    search: {
      provider: 'algolia',
      options: {
        apiKey: process.env.ALGOLIA_API_Key,
        appId: process.env.ALGOLIA_APP_ID,
        indexName: 'notifybc',
      },
    },
    footer: {
      message: 'The contents of this website are',
      copyright:
        '&copy;&nbsp;2016-present under the terms of the <a href="https://github.com/bcgov/NotifyBC/blob/main/LICENSE" target="_blank">Apache&nbsp;License, Version 2.0</a>.',
    },
  },
  rewrites: {
    'docs/getting-started/index.md': 'docs/index.md',
    'docs/getting-started/overview.md': 'docs/overview/index.md',
    'docs/getting-started/quickstart.md': 'docs/quickstart/index.md',
    'docs/getting-started/installation.md': 'docs/installation/index.md',
    'docs/getting-started/web-console.md': 'docs/web-console/index.md',
    'docs/config/overview.md': 'docs/config-overview/index.md',
    'docs/config/database.md': 'docs/config-database/index.md',
    'docs/config/adminIpList.md': 'docs/config-adminIpList/index.md',
    'docs/config/reverseProxyIpLists.md':
      'docs/config-reverseProxyIpLists/index.md',
    'docs/config/httpHost.md': 'docs/config-httpHost/index.md',
    'docs/config/internalHttpHost.md': 'docs/config-internalHttpHost/index.md',
    'docs/config/email.md': 'docs/config-email/index.md',
    'docs/config/sms.md': 'docs/config-sms/index.md',
    'docs/config/subscription.md': 'docs/config-subscription/index.md',
    'docs/config/notification.md': 'docs/config-notification/index.md',
    'docs/config/nodeRoles.md': 'docs/config-nodeRoles/index.md',
    'docs/config/cronJobs.md': 'docs/config-cronJobs/index.md',
    'docs/config/rsaKeys.md': 'docs/config-rsaKeys/index.md',
    'docs/config/workerProcessCount.md':
      'docs/config-workerProcessCount/index.md',
    'docs/config/middleware.md': 'docs/config-middleware/index.md',
    'docs/config/oidc.md': 'docs/config-oidc/index.md',
    'docs/config/certificates.md': 'docs/config-certificates/index.md',
    'docs/api/overview.md': 'docs/api-overview/index.md',
    'docs/api/subscription.md': 'docs/api-subscription/index.md',
    'docs/api/notification.md': 'docs/api-notification/index.md',
    'docs/api/config.md': 'docs/api-config/index.md',
    'docs/api/administrator.md': 'docs/api-administrator/index.md',
    'docs/api/bounce.md': 'docs/api-bounce/index.md',
    'docs/miscellaneous/benchmarks.md': 'docs/benchmarks/index.md',
    'docs/miscellaneous/bulk-import.md': 'docs/bulk-import/index.md',
    'docs/miscellaneous/developer-notes.md': 'docs/developer-notes/index.md',
    'docs/miscellaneous/upgrade.md': 'docs/upgrade/index.md',
    'docs/meta/conduct.md': 'docs/conduct/index.md',
    'docs/meta/acknowledgments.md': 'docs/acknowledgments/index.md',
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
        {
          find: /^.*\/VPHero\.vue$/,
          replacement: fileURLToPath(
            new URL('./components/Hero.vue', import.meta.url),
          ),
        },
      ],
    },
    server: {
      port: 8080,
    },
  },
  lastUpdated: true,
  head: [
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
      },
    ],
  ],
  mpa: false,
});

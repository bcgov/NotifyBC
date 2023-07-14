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
  mpa: true,
});

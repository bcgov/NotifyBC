import Administrators from '@/components/administrators';
import ApiExplorer from '@/components/api-explorer';
import Bounces from '@/components/bounces';
import Configurations from '@/components/configurations';
import Home from '@/components/home';
import Notifications from '@/components/notifications';
import OidcCallback from '@/components/oidc-callback';
import Subscriptions from '@/components/subscriptions';
import {createRouter, createWebHistory} from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: {name: 'Home'},
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: Subscriptions,
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications,
  },
  {
    path: '/configurations',
    name: 'Configurations',
    component: Configurations,
  },
  {
    path: '/administrators',
    name: 'Administrators',
    component: Administrators,
  },
  {
    path: '/bounces',
    name: 'Bounces',
    component: Bounces,
  },
  {
    path: '/api-explorer',
    name: 'API Explorer',
    component: ApiExplorer,
  },
  {
    path: '/oidc/callback',
    name: 'oidcCallback',
    component: OidcCallback,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

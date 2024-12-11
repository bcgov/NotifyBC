/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { createPinia } from 'pinia';
import router from '../router';
import { useDefaultStore } from '../store';
import vuetify from './vuetify';
import { loadFonts } from './webfontloader';

export function registerPlugins(app) {
  loadFonts();
  const pinia = createPinia();
  app.use(vuetify).use(router).use(pinia);
  app.config.globalProperties.$store = useDefaultStore();
}

/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import router from '../router';
import store from '../store';
import vuetify from './vuetify';
import {loadFonts} from './webfontloader';

export function registerPlugins(app) {
  loadFonts();
  app.use(vuetify).use(router).use(store);
}

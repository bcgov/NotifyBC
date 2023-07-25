import {UserManager} from 'oidc-client-ts';
import {defineStore} from 'pinia';

const apiUrlPrefix = window.apiUrlPrefix || '/api';
let accessToken;
try {
  accessToken = JSON.parse(sessionStorage.getItem('authorized')).accessToken
    .value;
  // eslint-disable-next-line no-empty
} catch (ex) {}
export const useDefaultStore = defineStore('default', {
  state: () => ({
    notifications: {
      items: [],
      filter: undefined,
      totalCount: 0,
      search: undefined,
    },
    subscriptions: {
      items: [],
      filter: undefined,
      totalCount: 0,
      search: undefined,
    },
    configurations: {
      items: [],
      filter: undefined,
      totalCount: 0,
      search: undefined,
    },
    administrators: {
      items: [],
      filter: undefined,
      totalCount: 0,
      search: undefined,
    },
    bounces: {
      items: [],
      filter: undefined,
      totalCount: 0,
      search: undefined,
    },
    accessToken,
    authnStrategy: undefined,
    oidcConfig: {
      authority: window.oidcAuthority,
      client_id: window.oidcClientId,
      silent_redirect_uri: window.location.origin + '/oidc/callback',
      automaticSilentRenew: true,
    },
  }),
  actions: {
    setLocalItems(payload) {
      this[payload.model].items = payload.items;
    },
    setTotalItemCount(payload) {
      this[payload.model].totalCount = payload.cnt;
    },
    setItemFilter(payload) {
      this[payload.model].filter = payload.filter;
    },
    setItemSearch(payload) {
      this[payload.model].search = payload.value;
    },
    setAuthnStrategy(payload) {
      this.authnStrategy = payload;
    },
    setAccessToken(payload) {
      let auth = JSON.parse(sessionStorage.getItem('authorized')) || {};
      if (payload && payload.length > 0) {
        auth.accessToken = {
          name: 'accessToken',
          schema: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
          },
          value: payload,
        };
        sessionStorage.setItem('authorized', JSON.stringify(auth));
      } else {
        delete auth.accessToken;
        if (Object.keys(auth).length > 0) {
          sessionStorage.setItem('authorized', JSON.stringify(auth));
        } else {
          sessionStorage.removeItem('authorized');
        }
        payload = undefined;
      }
      this['accessToken'] = payload;
      this.getAuthenticationStrategy();
    },

    async setItem(payload) {
      let id,
        method = 'POST',
        item = payload.item;
      if (item.id) {
        id = item.id;
        method = 'PUT';
        delete item.id;
        delete item.updated;
        delete item.created;
      }
      let req = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      };
      const url = apiUrlPrefix + '/' + payload.model + (id ? '/' + id : '');
      await setAuthorizationHeader(req, this);
      await fetch(url, req);
    },

    async deleteItem(payload) {
      const url = apiUrlPrefix + '/' + payload.model + '/' + payload.item.id;
      let req = {
        method: 'DELETE',
      };
      await setAuthorizationHeader(req, this);
      await fetch(url, req);
    },

    async fetchItems(payload) {
      let filter = payload.filter;
      if (filter) {
        filter = Object.assign({}, this[payload.model].filter, filter);
      } else {
        this.setItemSearch({model: payload.model});
      }
      this.setItemFilter({
        model: payload.model,
        filter: filter,
      });
      let url = apiUrlPrefix + '/' + payload.model;
      if (filter) {
        url += '?filter=' + encodeURIComponent(JSON.stringify(filter));
      }
      let req = {};
      await setAuthorizationHeader(req, this);
      let items;
      try {
        items = await (await fetch(url, req)).json();
      } catch (ex) {
        this.setLocalItems({model: payload.model, items: []});
        this.setTotalItemCount({model: payload.model, cnt: undefined});
        throw ex;
      }
      this.setLocalItems({model: payload.model, items});
      url = apiUrlPrefix + '/' + payload.model + '/count';
      if (filter && filter.where) {
        url += '?where=' + encodeURIComponent(JSON.stringify(filter.where));
      }
      req = {};
      await setAuthorizationHeader(req, this);
      let response = await (await fetch(url, req)).json();
      this.setTotalItemCount({
        model: payload.model,
        cnt: response.count,
      });
    },
    async getSubscribedServiceNames() {
      let url = apiUrlPrefix + '/subscriptions/services';
      let req = {};
      await setAuthorizationHeader(req, this);
      let res = await fetch(url, req);
      return res.json();
    },
    async getAuthenticationStrategy() {
      let url = apiUrlPrefix + '/administrators/whoami';
      let req = {};
      await setAuthorizationHeader(req, this);
      let res = await (await fetch(url, req)).json();
      this.setAuthnStrategy(res.authnStrategy);
    },
    async login(payload) {
      let url = apiUrlPrefix + '/administrators/login';
      payload.tokenName = 'webConsole';
      //12 hr
      payload.ttl = 43200;
      let req = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      await setAuthorizationHeader(req, this);
      let res = await (await fetch(url, req)).json();
      this.setAccessToken(res.token);
    },
  },
});

async function setAuthorizationHeader(req, state) {
  let accessToken = state['accessToken'];
  if (accessToken) {
    req.headers = req.headers || {};
    req.headers.Authorization = accessToken;
    return;
  }
  if (!window.oidcAuthority) return;
  const oidcUserManager = new UserManager(state.oidcConfig);
  try {
    const user = await oidcUserManager.getUser();
    if (user.access_token) {
      req.headers = req.headers || {};
      req.headers.Authorization = 'Bearer ' + user.access_token;
    }
  } catch (ex) {
    return;
  }
}

import axios from 'axios';
import {UserManager} from 'oidc-client';
import Vuex from 'vuex';

const apiUrlPrefix = window.apiUrlPrefix || '/api';
let accessToken;
try {
  accessToken = JSON.parse(sessionStorage.getItem('authorized')).accessToken
    .value;
  // eslint-disable-next-line no-empty
} catch (ex) {}
export default new Vuex.Store({
  state: {
    notifications: {
      items: [],
      filter: undefined,
      totalCount: undefined,
      search: undefined,
    },
    subscriptions: {
      items: [],
      filter: undefined,
      totalCount: undefined,
      search: undefined,
    },
    configurations: {
      items: [],
      filter: undefined,
      totalCount: undefined,
      search: undefined,
    },
    administrators: {
      items: [],
      filter: undefined,
      totalCount: undefined,
      search: undefined,
    },
    bounces: {
      items: [],
      filter: undefined,
      totalCount: undefined,
      search: undefined,
    },
    accessToken,
    authnStrategy: undefined,
    oidcConfig: {
      authority: window.oidcAuthority,
      client_id: window.oidcClientId,
      silent_redirect_uri: window.location.origin + '/oidc/callback',
      response_type: 'token id_token',
      automaticSilentRenew: true,
    },
  },
  mutations: {
    setLocalItems(state, payload) {
      state[payload.model].items = payload.items;
    },
    setTotalItemCount(state, payload) {
      state[payload.model].totalCount = payload.cnt;
    },
    setItemFilter(state, payload) {
      state[payload.model].filter = payload.filter;
    },
    setItemSearch(state, payload) {
      state[payload.model].search = payload.value;
    },
    setAuthnStrategy(state, payload) {
      state.authnStrategy = payload;
    },
    setAccessToken(state, payload) {
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
      state['accessToken'] = payload;
      this.dispatch('getAuthenticationStrategy');
    },
  },
  actions: {
    async setItem({state}, payload) {
      let id,
        method = 'post',
        item = payload.item;
      if (item.id) {
        id = item.id;
        method = 'put';
        delete item.id;
        delete item.updated;
        delete item.created;
      }
      let req = {
        method: method,
        url: apiUrlPrefix + '/' + payload.model + (id ? '/' + id : ''),
        data: item,
      };
      await setAuthorizationHeader(req, state);
      await axios(req);
    },
    async deleteItem({state}, payload) {
      let req = {
        method: 'delete',
        url: apiUrlPrefix + '/' + payload.model + '/' + payload.item.id,
      };
      await setAuthorizationHeader(req, state);
      await axios(req);
    },
    async fetchItems({commit, state}, payload) {
      let filter = payload.filter;
      if (filter) {
        filter = Object.assign({}, state[payload.model].filter, filter);
      } else {
        commit('setItemSearch', {model: payload.model});
      }
      commit('setItemFilter', {
        model: payload.model,
        filter: filter,
      });
      let url = apiUrlPrefix + '/' + payload.model;
      if (filter) {
        url += '?filter=' + encodeURIComponent(JSON.stringify(filter));
      }
      let req = {
        url: url,
      };
      await setAuthorizationHeader(req, state);
      let items;
      try {
        items = await axios(req);
      } catch (ex) {
        commit('setLocalItems', {model: payload.model, items: []});
        commit('setTotalItemCount', {model: payload.model, cnt: undefined});
        throw ex;
      }
      commit('setLocalItems', {model: payload.model, items: items.data});
      url = apiUrlPrefix + '/' + payload.model + '/count';
      if (filter && filter.where) {
        url += '?where=' + encodeURIComponent(JSON.stringify(filter.where));
      }
      req = {
        url: url,
      };
      await setAuthorizationHeader(req, state);
      let response = await axios(req);
      commit('setTotalItemCount', {
        model: payload.model,
        cnt: response.data.count,
      });
    },
    async getSubscribedServiceNames({state}) {
      let url = apiUrlPrefix + '/subscriptions/services';
      let req = {
        url: url,
      };
      await setAuthorizationHeader(req, state);
      let res = await axios(req);
      return res.data;
    },
    async getAuthenticationStrategy({state, commit}) {
      let url = apiUrlPrefix + '/administrators/whoami';
      let req = {
        url: url,
      };
      await setAuthorizationHeader(req, state);
      let res = await axios(req);
      commit('setAuthnStrategy', res.data.authnStrategy);
    },
    async login({state, commit}, payload) {
      let url = apiUrlPrefix + '/administrators/login';
      payload.tokenName = 'webConsole';
      //12 hr
      payload.ttl = 43200;
      let req = {
        url: url,
        method: 'post',
        data: payload,
      };
      await setAuthorizationHeader(req, state);
      let res = await axios(req);
      commit('setAccessToken', res.data.token);
    },
  },
  strict: process.env.NODE_ENV !== 'production',
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

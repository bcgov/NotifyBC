<!--
 Copyright 2016-present Province of British Columbia

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 -->
<template>
  <v-toolbar-items class="center-text">
    <div v-if="$store.authnStrategy === 'clientCertificate'">
      <v-tooltip bottom>
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props">mdi-check-decagram</v-icon>
        </template>
        <span>You are super-admin</span>
      </v-tooltip>
    </div>
    <template v-else>
      <div v-if="$store.authnStrategy === 'ip' && $store.role === 'SuperAdmin'">
        <v-tooltip bottom>
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" icon="mdi-shield-check"></v-icon>
          </template>
          <span>You are super-admin</span>
        </v-tooltip>
      </div>
      <template v-else>
        <template v-if="!oidcUserManager">
          <template v-if="$store.authnStrategy === 'accessToken'">
            <div class="mr-1">Access Token</div>
            <v-text-field
              style="min-width: 200px"
              theme="dark"
              single-line
              hide-details
              v-model="accessToken"
              @change="setAccessToken"
            ></v-text-field>
          </template>
          <v-dialog
            v-model="dialog"
            max-width="500px"
            v-if="$store.role === 'Anonymous'"
          >
            <template v-slot:activator="{ props }">
              <v-btn plain v-bind="props">
                Login<v-icon>mdi-login</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Login</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="email"
                        label="email"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="password"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPassword = !showPassword"
                        :type="showPassword ? 'text' : 'password'"
                        label="password"
                        counter
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" v-if="loginError">
                      <v-alert color="red" dense type="error">
                        {{ loginError }}
                      </v-alert>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="login"> Submit </v-btn>
                <v-btn color="error" text @click="dialog = false">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-else>
          <v-btn plain @click="oidcLogin" v-if="!oidcUser">
            Login<v-icon>mdi-login</v-icon>
          </v-btn>
          <template v-else>
            <div>{{ oidcUser.profile.name }}</div>
            <v-btn plain @click="oidcLogout">
              Logout<v-icon>mdi-logout</v-icon>
            </v-btn>
          </template>
        </template>
      </template>
    </template>
  </v-toolbar-items>
</template>

<script>
import { UserManager } from 'oidc-client-ts';

export default {
  data: function () {
    return {
      dialog: false,
      showPassword: false,
      email: undefined,
      password: undefined,
      loginError: undefined,
      oidcUserManager:
        window.oidcAuthority && new UserManager(this.$store.oidcConfig),
      oidcUser: undefined,
      accessToken: this.$store.accessToken,
    };
  },
  computed: {
    authnStrategy: {
      get() {
        return this.$store.authnStrategy;
      },
    },
  },
  beforeMount: async function () {
    await this.$store.getAuthenticationStrategy();
  },
  mounted: async function () {
    if (!window.oidcAuthority) {
      return;
    }
    try {
      this.oidcUser = await this.oidcUserManager.getUser();
      if (!this.oidcUser) {
        throw new Error();
      }
    } catch (ex) {
      try {
        this.oidcUser = await this.oidcUserManager.signinRedirectCallback();
        this.oidcUserManager.clearStaleState();
        await this.$router.push(this.$route.path);
        this.$router.go();
      } catch (ex) {
        true;
      }
    }
  },
  methods: {
    setAccessToken(evt) {
      this.$store.setAccessToken(evt.target.value);
    },
    oidcLogin: async function () {
      let config = this.$store.oidcConfig;
      config = { ...config, redirect_uri: window.location.href };
      let um = new UserManager(config);
      await um.signinRedirect();
    },
    oidcLogout: async function () {
      let config = this.$store.oidcConfig;
      config = { ...config, post_logout_redirect_uri: window.location.href };
      let um = new UserManager(config);
      await um.signoutRedirect();
    },
    login: async function () {
      try {
        this.loginError = undefined;
        await this.$store.login({
          email: this.email,
          password: this.password,
        });
        this.dialog = false;
      } catch (ex) {
        this.loginError = 'Login failed.';
      }
    },
  },
};
</script>

<style scoped lang="less">
.v-toolbar-items {
  padding: 4px 16px;
}
</style>

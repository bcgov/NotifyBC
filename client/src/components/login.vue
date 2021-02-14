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
    <div v-if="$store.state.authnStrategy === 'ipWhitelist'">
      <v-tooltip bottom>
        <template v-slot:activator="{on}">
          <v-icon v-on="on">verified_user</v-icon>
        </template>
        <span>You are super-admin</span>
      </v-tooltip>
    </div>
    <template v-if="$store.state.authnStrategy === 'accessToken'">
      <div class="mr-1">Access Token</div>
      <v-text-field
        dark
        single-line
        hide-details
        :value="accessToken"
        @change="v => (accessToken = v)"
      ></v-text-field>
    </template>
    <v-dialog
      v-model="dialog"
      max-width="500px"
      v-if="$store.state.authnStrategy === 'anonymous'"
    >
      <template v-slot:activator="{on}">
        <v-btn plain v-on="on"> Login<v-icon>login</v-icon> </v-btn>
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
          <v-btn color="primary" text @click="login">
            Submit
          </v-btn>
          <v-btn color="error" text @click="dialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar-items>
</template>

<script>
export default {
  data: function() {
    return {
      dialog: false,
      showPassword: false,
      email: undefined,
      password: undefined,
      loginError: undefined,
    };
  },
  computed: {
    accessToken: {
      get() {
        return this.$store.state.accessToken;
      },
      set(value) {
        this.$store.commit('setAccessToken', value);
      },
    },
    authnStrategy: {
      get() {
        return this.$store.state.authnStrategy;
      },
    },
  },
  beforeMount: async function() {
    await this.$store.dispatch('getAuthenticationStrategy');
  },
  methods: {
    login: async function() {
      try {
        this.loginError = undefined;
        await this.$store.dispatch('login', {
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

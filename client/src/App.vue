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
  <v-app id="inspire">
    <v-navigation-drawer
      persistent
      v-model="drawer"
      enable-resize-watcher
      app
      v-if="this.$route.name !== 'oidcCallback'"
    >
      <v-list dense>
        <v-list-item to="/home">
          <v-list-item-action>
            <v-icon>home</v-icon>
          </v-list-item-action>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item to="/subscriptions/">
          <v-list-item-action>
            <v-icon>list</v-icon>
          </v-list-item-action>
          <v-list-item-title>Subscriptions</v-list-item-title>
        </v-list-item>
        <v-list-item to="/notifications/">
          <v-list-item-action>
            <v-icon>email</v-icon>
          </v-list-item-action>
          <v-list-item-title>Notifications</v-list-item-title>
        </v-list-item>
        <v-list-item to="/configurations/">
          <v-list-item-action>
            <v-icon>settings_applications</v-icon>
          </v-list-item-action>
          <v-list-item-title>Configurations</v-list-item-title>
        </v-list-item>
        <v-list-item to="/administrators/">
          <v-list-item-action>
            <v-icon>security</v-icon>
          </v-list-item-action>
          <v-list-item-title>Administrators</v-list-item-title>
        </v-list-item>
        <v-list-item to="/bounces/">
          <v-list-item-action>
            <v-icon>report</v-icon>
          </v-list-item-action>
          <v-list-item-title>Bounces</v-list-item-title>
        </v-list-item>
        <v-list-item to="/api-explorer/">
          <v-list-item-action>
            <v-icon>code</v-icon>
          </v-list-item-action>
          <v-list-item-title>API Explorer</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      color="indigo"
      dark
      app
      v-if="this.$route.name !== 'oidcCallback'"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
        >NotifyBC Web Console -
        {{ this.$router.currentRoute.name }}</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <login />
    </v-app-bar>
    <main>
      <v-main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
    </main>
    <v-footer color="indigo" app v-if="this.$route.name !== 'oidcCallback'">
      <span class="white--text">
        &copy; 2016-present under the terms of
        <a
          href="https://github.com/bcgov/NotifyBC/blob/master/LICENSE"
          target="_"
          >Apache License, Version 2.0</a
        >
      </span>
    </v-footer>
  </v-app>
</template>
<script>
import Login from './components/login';
export default {
  name: 'app',
  components: {
    Login,
  },
  data: () => ({
    drawer: true,
  }),
  props: {
    source: String,
  },
};
</script>

<style scoped lang="less">
.white--text a {
  color: white !important;
}
.center-text {
  align-items: center;
}
</style>

<style lang="less">
a[target='_blank']:after {
  content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQElEQVR42qXKwQkAIAxDUUdxtO6/RBQkQZvSi8I/pL4BoGw/XPkh4XigPmsUgh0626AjRsgxHTkUThsG2T/sIlzdTsp52kSS1wAAAABJRU5ErkJggg==);
}
</style>

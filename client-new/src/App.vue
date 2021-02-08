<template>
  <v-app id="inspire">
    <v-navigation-drawer persistent v-model="drawer" enable-resize-watcher app>
      <v-list dense>
        <v-list-item to="/home">
          <v-list-item-action>
            <v-icon>home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/subscriptions/">
          <v-list-item-action>
            <v-icon>list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Subscriptions</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/notifications/">
          <v-list-item-action>
            <v-icon>email</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Notifications</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/configurations/">
          <v-list-item-action>
            <v-icon>settings_applications</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Configurations</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/administrators/">
          <v-list-item-action>
            <v-icon>security</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Administrators</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/bounces/">
          <v-list-item-action>
            <v-icon>report</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Bounces</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/api-explorer/">
          <v-list-item-action>
            <v-icon>code</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>API Explorer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="indigo" dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
        >NotifyBC Web Console -
        {{ this.$router.currentRoute.name }}</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-toolbar-items class="center-text">
        <div class="mr-1">Access Token</div>
        <v-text-field
          dark
          single-line
          hide-details
          v-model="accessToken"
        ></v-text-field>
      </v-toolbar-items>
    </v-app-bar>
    <main>
      <v-main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
    </main>
    <v-footer color="indigo" app>
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
export default {
  name: 'app',
  data: () => ({
    drawer: true,
  }),
  props: {
    source: String,
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

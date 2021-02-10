<template>
  <v-toolbar-items class="center-text" v-if="showWidget">
    <template v-if="showAccessTokenWidget">
      <div class="mr-1">Access Token</div>
      <v-text-field
        dark
        single-line
        hide-details
        v-model="accessToken"
      ></v-text-field>
    </template>
    <template v-if="showLoginWidget">Login<v-icon>login</v-icon></template>
  </v-toolbar-items>
</template>

<script>
export default {
  data: function() {
    return {
      showWidget: false,
      showAccessTokenWidget: false,
      showLoginWidget: false,
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
  },
  beforeMount: async function() {
    await this.$store.dispatch('getAuthenticationStrategy');
    this.showWidget = this.$store.state.authnStrategy !== 'ipWhitelist';
    this.showAccessTokenWidget =
      this.$store.state.authnStrategy !== 'anonymous';
    this.showLoginWidget = this.$store.state.authnStrategy === 'anonymous';
  },
};
</script>

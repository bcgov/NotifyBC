<template>
  <v-toolbar-items class="center-text">
    <div class="mr-1">Access Token</div>
    <v-text-field
      dark
      single-line
      hide-details
      v-model="accessToken"
    ></v-text-field>
  </v-toolbar-items>
</template>

<script>
export default {
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

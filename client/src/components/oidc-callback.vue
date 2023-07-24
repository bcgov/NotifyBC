<template><div>Ok</div></template>
<script>
import {UserManager} from 'oidc-client';

export default {
  mounted: async function () {
    let um = new UserManager(this.$store.oidcConfig);
    await um.signinSilentCallback();
  },
};
</script>

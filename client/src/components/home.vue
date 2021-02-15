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
  <div>
    <h2>Welcome</h2>
    <p>
      If you are a NotifyBC administrator, you can manage following items in
      curated web console UI
    </p>
    <ul>
      <li><router-link to="/subscriptions">Subscriptions</router-link></li>
      <li><router-link to="/notifications">Notifications</router-link></li>
      <li><router-link to="/configurations">Configurations</router-link></li>
      <li><router-link to="/administrators">Administrators</router-link></li>
      <li><router-link to="/bounces">Bounces</router-link></li>
    </ul>
    <p>
      Alternatively, use
      <router-link to="/api-explorer">API Explorer</router-link> to manipulate
      raw JSON object through REST API for maximum flexibility.
      <span v-if="clientId"
        >For client_id in Authorize dialog, use {{ clientId }}.</span
      >
    </p>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      clientId: window.oidcClientId,
    };
  },
};
</script>

<style scoped></style>

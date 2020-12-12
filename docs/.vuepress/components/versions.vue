<template>
  <span class="nav-item">
    Version:
    <select v-model="selected">
      <option v-for="option in options" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </span>
</template>

<script>
import Axios from 'axios';
export default {
  data() {
    return {
      selected: undefined,
      options: []
    };
  },
  created: async function() {
    try {
      const res = await Axios.get('/NotifyBC/versions.json');
      this.options = res.data;
      const path = window.location.pathname.toLowerCase();
      const versionIdx = path.indexOf('/version/');
      if (versionIdx >= 0) {
        const start = versionIdx + 9;
        const end = path.indexOf('/', start);
        this.selected = path.substring(start, end);
      } else {
        this.selected = 'main';
      }
    } catch (ex) {}
  }
};
</script>

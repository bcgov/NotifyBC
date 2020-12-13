<template>
  <span class="nav-item" v-if="options && options.length > 0">
    Version:
    <select v-model="selected" @change="onChange">
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
      if (path.startsWith('/notifybc/version/')) {
        const start = 18;
        const end = path.indexOf('/', start);
        this.selected = path.substring(start, end);
      } else {
        this.selected = 'main';
      }
    } catch (ex) {}
  },
  methods: {
    onChange(event) {
      const targetVersionPath =
        this.selected === 'main' ? '' : `/version/${this.selected}`;
      const path = window.location.pathname.toLowerCase();
      let startIdx = 9;
      const versionIdx = path.indexOf('/version/');
      if (versionIdx >= 0) {
        startIdx = versionIdx + 9;
      }
      const endIdx = path.indexOf('/', startIdx);
      window.location.pathname =
        window.location.pathname.substring(0, 9) +
        targetVersionPath +
        window.location.pathname.substring(endIdx);
    }
  }
};
</script>

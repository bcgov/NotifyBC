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
    <iframe id="nb-api-explorer" :src="ApiExplorerUrlPrefix" />
  </div>
</template>
<script>
/*eslint no-unused-vars: "off" */
import iFrameResize from 'iframe-resizer';
export default {
  data: function() {
    return {
      ApiExplorerUrlPrefix: `${window.apiUrlPrefix || '/api'}/explorer`,
      iFrameResizer: undefined,
    };
  },
  mounted: async function() {
    $('#nb-api-explorer').iFrameResize();
    this.iFrameResizer = $('#nb-api-explorer')[0].iFrameResizer;
  },
  beforeDestroy: function() {
    this.iFrameResizer && this.iFrameResizer.close();
  },
};
</script>
<style scoped>
iframe {
  min-width: 100%;
  width: 1px;
  border: none;
}
</style>

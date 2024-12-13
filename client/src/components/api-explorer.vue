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
    <iframe id="nb-api-explorer" v-resized :src="ApiExplorerUrlPrefix"></iframe>
  </div>
</template>
<script>
import iframeResize from '@iframe-resizer/parent';
export default {
  data: function () {
    return {
      ApiExplorerUrlPrefix: `${window.apiUrlPrefix || '/api'}/explorer`,
    };
  },

  directives: {
    // enables v-resize in template
    resized: {
      mounted: (el) => {
        el.addEventListener('load', (ev) => {
          // credit: - [iframe-resizer](https://iframe-resizer.com/)
          iframeResize({ license: 'GPLv3' }, el);
          const new_style_element = document.createElement('style');
          new_style_element.textContent =
            '.swagger-ui .dialog-ux .modal-ux {top: 10px; transform: translate(-50%);}';
          ev.target.contentDocument.head.appendChild(new_style_element);
        });
      },
      unmounted: function (el) {
        el.iFrameResizer.disconnect();
      },
    },
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

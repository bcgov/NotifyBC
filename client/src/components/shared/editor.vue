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
    <div id="nb-item-editor"></div>
    <v-alert color="red" dense type="error" v-if="errorMessage">
      {{ errorMessage }}
    </v-alert>
    <v-btn color="primary" @click="setCurrentlyEditedItem">save</v-btn>
    <v-btn color="error" @click="resetEditor">cancel</v-btn>
  </div>
</template>

<script>
import 'json-editor';
import 'summernote';
export default {
  data: function () {
    return {
      jsonEditor: null,
      currentlyEditedItem: undefined,
      errorMessage: undefined,
    };
  },
  props: ['item', 'schema', 'model'],
  methods: {
    setCurrentlyEditedItem: async function () {
      try {
        this.errorMessage = undefined;
        let item = this.jsonEditor.getValue();
        await this.$store.dispatch('setItem', {
          model: this.model,
          item: item.raw,
        });
        this.currentlyEditedItem = item;
        this.$emit('submit');
      } catch (ex) {
        this.errorMessage = ex;
        this.createJsonEditor();
      }
    },
    resetEditor: function () {
      this.errorMessage = undefined;
      this.createJsonEditor();
      this.$emit('cancel');
    },
    createJsonEditor: function () {
      let element = $('#nb-item-editor', this.$el).get(0);
      if (this.jsonEditor) {
        this.jsonEditor.destroy();
      }
      this.jsonEditor = new window.JSONEditor(element, {
        theme: 'bootstrap3',
        iconlib: 'fontawesome4',
        keep_oneof_values: false,
        required_by_default: false,
        // required: ['serviceName', 'channel', 'message'],
        remove_empty_properties: true,
        disable_collapse: true,
        startval: this.item,
        schema: this.schema,
      });
    },
  },
  mounted: function () {
    this.createJsonEditor();
  },
  beforeDestroy: function () {
    this.jsonEditor && this.jsonEditor.destroy();
  },
};
</script>

<style lang="less">
.datatable__expand-content:not(.v-leave-active) {
  height: auto !important;
}

#nb-item-editor {
  @import 'bootstrap/less/bootstrap.less';
  @import (less) 'summernote/dist/summernote.css';
  select {
    -webkit-appearance: menulist-button;
  }
  .btn {
    min-width: unset;
  }
}

// some divs created by summernote and jquery-ui are
// appended to body, creating extra empty bottom space
body {
  & > .note-popover.popover.bottom.in,
  & > .ui-helper-hidden-accessible {
    display: none;
  }
}
</style>

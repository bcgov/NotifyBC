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
import {JSONEditor} from '@json-editor/json-editor';
import {Jodit} from 'jodit/es2015/jodit.min.js';
window.Jodit = Jodit;
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
          item: item,
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
      this.jsonEditor = new JSONEditor(element, {
        theme: 'bootstrap4',
        iconlib: 'fontawesome5',
        keep_oneof_values: false,
        required_by_default: false,
        // required: ['serviceName', 'channel', 'message'],
        remove_empty_properties: true,
        disable_collapse: true,
        schema: this.schema,
        ...(this.item && {startval: this.item.raw}),
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

<style src="jodit/es2015/jodit.min.css"></style>
<style lang="less">
.datatable__expand-content:not(.v-leave-active) {
  height: auto !important;
}

#nb-item-editor {
  @import (less) 'bootstrap/dist/css/bootstrap.css';
  @import (less) '@json-editor/json-editor/src/editors/object.css';
  @import (less) '@json-editor/json-editor/src/style.css';
  select {
    -webkit-appearance: menulist-button;
  }
  .btn {
    min-width: unset;
  }
}
</style>

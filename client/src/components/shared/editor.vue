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
    <v-alert closable color="red" dense type="error" v-if="errorMessage">
      {{ errorMessage }}
    </v-alert>
    <v-btn color="primary" @click="setCurrentlyEditedItem">
      <span v-if="!submitting">Save</span>
      <v-progress-circular
        indeterminate
        v-if="submitting"
      ></v-progress-circular>
    </v-btn>
    <v-btn color="error" @click="resetEditor">cancel</v-btn>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { JSONEditor } from '@json-editor/json-editor';
// @ts-ignore
import { Jodit } from 'jodit/es2015/jodit.min.js';
import { defineComponent } from 'vue';

(window as any).Jodit = Jodit;
export default defineComponent({
  data: function () {
    return {
      jsonEditor: null,
      currentlyEditedItem: undefined,
      errorMessage: undefined,
      submitting: false,
    };
  },
  emits: ['submit', 'cancel'],
  props: ['item', 'schema', 'model'],
  methods: {
    setCurrentlyEditedItem: async function () {
      try {
        this.submitting = true;
        this.errorMessage = undefined;
        // @ts-ignore
        let item = this.jsonEditor.getValue();
        // @ts-ignore
        await this.$store.setItem({
          model: this.model,
          item: item,
        });
        this.currentlyEditedItem = item;
        this.$emit('submit');
      } catch (ex) {
        // @ts-ignore
        this.errorMessage = ex;
        this.createJsonEditor();
      } finally {
        this.submitting = false;
      }
    },
    resetEditor: function () {
      this.errorMessage = undefined;
      this.createJsonEditor();
      this.$emit('cancel');
    },
    createJsonEditor: function () {
      // @ts-ignore
      let element = $('#nb-item-editor', this.$el).get(0);
      if (this.jsonEditor) {
        // @ts-ignore
        this.jsonEditor.destroy();
      }
      this.jsonEditor = new JSONEditor(element, {
        theme: 'spectre',
        keep_oneof_values: false,
        required_by_default: false,
        // required: ['serviceName', 'channel', 'message'],
        remove_empty_properties: true,
        disable_collapse: true,
        schema: this.schema,
        ...(this.item && { startval: this.item }),
      });
    },
  },
  mounted: function () {
    this.createJsonEditor();
  },
  beforeDestroy: function () {
    // @ts-ignore
    this.jsonEditor && this.jsonEditor.destroy();
  },
});
</script>

<style src="jodit/es2015/jodit.min.css"></style>
<style lang="less">
.datatable__expand-content:not(.v-leave-active) {
  height: auto !important;
}

:root {
  --jd-color-background-default: rgb(var(--v-theme-background));
  --jd-color-text-icons: rgb(var(--v-theme-text));
}

#nb-item-editor {
  @import (less) 'spectre.css/dist/spectre.css';
  select {
    -webkit-appearance: menulist-button;
  }
  .btn {
    min-width: unset;
  }
  div[data-schematype]:not([data-schematype='object']):hover {
    background-color: unset;
  }
  .form-select,
  .form-input,
  .ace-tm,
  .je-modal {
    background-color: rgb(var(--v-theme-background)) !important;
    color: initial !important;
  }
}
.jodit-dialog__panel {
  background-color: rgb(var(--v-theme-background)) !important;
}
</style>

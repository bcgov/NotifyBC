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
    <v-text-field
      append-icon="search"
      hint='Enter free style text for full text search or MongoDB <a href="https://www.mongodb.com/docs/manual/tutorial/query-documents/" target="_blank">query</a> compatible JSON string for parametrized search. For example, to search for items updated in year 2023, enter <i>{"updated": {"$gte": "2023-01-01","$lt": "2024-01-01"}}</i>'
      label="Search"
      single-line
      persistent-hint
      v-model="search"
    >
      <template v-slot:message="{ message }">
        <span v-html="message"></span>
      </template>
    </v-text-field>
    <v-data-table-server
      :headers="headers"
      :items="$store[this.model].items"
      class="elevation-1"
      :items-length="$store[this.model].totalCount"
      :loading="loading"
      :no-data-text="noDataText"
      :options="options"
      @update:options="updateOptions"
    >
      <template #item="props">
        <slot
          :props="props"
          :viewItem="viewItem"
          :editItem="editItem"
          :deleteItem="deleteItem"
        />
      </template>
      <template #expanded-row="props">
        <tr>
          <td :colspan="props.columns.length">
            <component
              :is="currentExpanderView"
              class="ma-2"
              @submit="submitEditPanel(props)"
              @cancel="cancelEditPanel(props)"
              :item="props.item"
              :schema="schema"
              :model="model"
            />
          </td>
        </tr>
      </template>
      <template #tfoot="tfootProps">
        <tfoot class="v-data-table__tfoot">
          <tr>
            <td :colspan="tfootProps.columns.length">
              <v-expansion-panels v-model="newPanelExpanded">
                <v-expansion-panel elevation="0">
                  <v-expansion-panel-title
                    :hide-actions="true"
                    class="d-flex justify-center"
                  >
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          :icon="
                            newPanelExpanded === 0 ? 'keyboard_arrow_up' : 'add'
                          "
                          color="indigo"
                        >
                        </v-btn>
                      </template>
                      new
                    </v-tooltip>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-card>
                      <v-card-text class="bg-grey-lighten-3">
                        <slot
                          name="newItem"
                          :submitNewPanel="submitNewPanel"
                          :cancelNewPanel="cancelNewPanel"
                          :schema="schema"
                          :model="model"
                        >
                          <model-editor
                            class="ma-2"
                            @submit="submitNewPanel"
                            @cancel="cancelNewPanel"
                            :schema="schema"
                            :model="model"
                          />
                        </slot>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </td>
          </tr>
        </tfoot>
      </template>
      <template #top>
        <v-dialog v-model="dialogDelete" width="auto">
          <v-card>
            <v-card-text
              >Are you sure you want to delete this item?</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red darken-2"
                variant="text"
                @click="deleteItemConfirm"
                >Yes</v-btn
              >
              <v-btn color="primary" variant="text" @click="deleteItemCancel"
                >No</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-data-table-server>
  </div>
</template>

<script>
import ModelEditor from './editor';
import ModelViewer from './viewer';
const NoDataText = 'No data available';
export default {
  components: {
    ModelEditor,
    ModelViewer,
  },
  props: ['model', 'headers', 'schema'],
  computed: {
    accessToken: {
      get() {
        return this.$store.accessToken;
      },
    },
    search: {
      get() {
        return this.$store[this.model].search;
      },
      set(value) {
        this.$store.setItemSearch({
          model: this.model,
          value: value,
        });
        let filter = {
          where: undefined,
        };
        if (value !== '') {
          filter.where = {
            $text: {
              $search: value,
            },
          };
          try {
            let searchJson = JSON.parse(value);
            if (searchJson instanceof Object) {
              filter.where = searchJson;
            }
            /*eslint no-empty: "off" */
          } catch (ex) {}
          filter.skip = 0;
          this.options.page = 1;
        }
        this.fetchItems(filter);
      },
    },
  },
  methods: {
    fetchItems: async function (filter) {
      this.loading = true;
      this.noDataText = NoDataText;
      try {
        await this.$store.fetchItems({
          model: this.model,
          filter: filter,
        });
      } catch (ex) {
        this.noDataText = 'Error getting data';
      }
      this.loading = false;
    },
    handleToggle: function (expanderView, props) {
      const isExpanded = props.isExpanded(props.item);
      let toggleExpand = false;
      let collapseOthers = false;
      if (
        this.expanded.length > 0 &&
        this.expanded[0].index !== props.item.index
      ) {
        collapseOthers = true;
        toggleExpand = true;
      } else if (this.currentExpanderView === expanderView) {
        toggleExpand = true;
      } else if (!isExpanded) {
        toggleExpand = true;
      }
      if (collapseOthers) {
        props.toggleExpand(this.expanded.pop());
      }
      this.currentExpanderView = expanderView;
      if (toggleExpand) {
        props.toggleExpand(props.item);
        if (!isExpanded) {
          this.expanded.push(props.item);
        } else {
          this.expanded.pop(props.item);
        }
      }
    },
    editItem: function (props) {
      this.handleToggle('modelEditor', props);
      this.$emit('inputFormExpanded');
    },
    viewItem: function (props) {
      this.handleToggle('modelViewer', props);
    },
    submitEditPanel: function ({ toggleExpand, item }) {
      toggleExpand(this.expanded.pop());
      this.$store.fetchItems({
        model: this.model,
        filter: {},
      });
    },
    cancelEditPanel: function ({ toggleExpand, item }) {
      toggleExpand(this.expanded.pop());
    },
    submitNewPanel: function () {
      this.newPanelExpanded = undefined;
      this.$store.fetchItems({
        model: this.model,
        filter: {},
      });
    },
    cancelNewPanel: function () {
      this.newPanelExpanded = undefined;
    },
    deleteItem: function (props) {
      this.deletingItem = props.item;
      this.dialogDelete = true;
    },
    deleteItemCancel: function () {
      this.deletingItem = undefined;
      this.dialogDelete = false;
    },
    deleteItemConfirm: async function () {
      await this.$store.deleteItem({
        model: this.model,
        item: this.deletingItem.raw,
      });
      await this.$store.fetchItems({
        model: this.model,
        filter: {},
      });
      this.deleteItemCancel();
    },
    updateOptions: async function (newOptions) {
      let filter;
      this.options = newOptions;
      if (this.options.itemsPerPage >= -1) {
        filter = filter || {};
        if (this.options.itemsPerPage > 0) {
          filter.limit = this.options.itemsPerPage;
          filter.skip = this.options.itemsPerPage * (this.options.page - 1);
        } else {
          filter.limit = undefined;
          filter.skip = 0;
        }
      }
      if (this.options.sortBy.length > 0) {
        filter = filter || {};
        filter.order = this.options.sortBy.map((e, i) => {
          return [e.key, e.order];
        });
      }
      await this.fetchItems(filter);
      return;
    },
  },
  watch: {
    newPanelExpanded: function (newVal) {
      if (newVal === 0) {
        this.$emit('inputFormExpanded');
      }
    },
    accessToken: async function () {
      await this.fetchItems(this.$store[this.model].filter);
    },
  },
  data: function () {
    return {
      newPanelExpanded: undefined,
      currentExpanderView: 'modelEditor',
      options: { itemsPerPage: 10 },
      loading: true,
      expanded: [],
      noDataText: NoDataText,
      dialogDelete: false,
      deletingItem: undefined,
    };
  },
};
</script>
<style lang="less" scoped>
.table__overflow {
  overflow-x: visible;
  overflow-y: visible;
}
</style>

<style lang="less">
.table__overflow .btn.btn--disabled {
  pointer-events: unset;
}
</style>

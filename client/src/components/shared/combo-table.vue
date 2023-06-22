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
      hint='Enter free style text for full text search or LoopBack <a href="https://loopback.io/doc/en/lb4/Where-filter.html" target="_blank">where filter</a> compatible JSON string for parametrized search, for example {"channel": "email"}.'
      label="Search"
      single-line
      persistent-hint
      v-model="search"
    >
      <template v-slot:message="{message}">
        <span v-html="message"></span>
      </template>
    </v-text-field>
    <v-data-table-server
      v-model:items-per-page="options.itemsPerPage"
      :page="options.page"
      :headers="headers"
      :items="$store.state[this.model].items"
      :single-expand="true"
      :expanded="expanded"
      class="elevation-1"
      :items-length="$store.state[this.model].totalCount"
      :loading="loading"
      :no-data-text="noDataText"
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
      <!--
        <template #expanded-row="props">
        <tr>
          <td :colspan="props.headers.length">
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
      <template slot="footer">
        <v-expansion-panels v-model="newPanelExpanded">
          <v-expansion-panel>
            <v-expansion-panel-title :hide-actions="true">
              <v-tooltip bottom>
                <template v-slot:activator="{props}">
                  <div class="text-center" color="indigo">
                    <v-btn v-bind="props" text icon>
                      <v-icon large color="indigo">{{
                        newPanelExpanded === 0 ? 'keyboard_arrow_up' : 'add'
                      }}</v-icon>
                    </v-btn>
                  </div>
                </template>
                new
              </v-tooltip>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-card>
                <v-card-text class="grey lighten-3">
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
      </template>
      -->
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
        return this.$store.state.accessToken;
      },
    },
    search: {
      get() {
        return this.$store.state[this.model].search;
      },
      set(value) {
        this.$store.commit('setItemSearch', {
          model: this.model,
          value: value,
        });
        let filter = {
          where: undefined,
        };
        if (value !== '') {
          filter.where = {
            $text: {
              search: value,
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
        await this.$store.dispatch('fetchItems', {
          model: this.model,
          filter: filter,
        });
      } catch (ex) {
        this.noDataText = 'Error getting data';
      }
      this.loading = false;
    },
    editItem: function (props) {
      let isExpanded = !props.isExpanded;
      if (this.currentExpanderView !== 'modelEditor' && !isExpanded) {
        isExpanded = !isExpanded;
      }
      this.currentExpanderView = 'modelEditor';
      props.expand(isExpanded);
      this.$emit('inputFormExpanded');
    },
    viewItem: function (props) {
      let isExpanded = !props.isExpanded;
      if (this.currentExpanderView !== 'modelViewer' && !isExpanded) {
        isExpanded = !isExpanded;
      }
      this.currentExpanderView = 'modelViewer';
      props.expand(isExpanded);
    },
    submitEditPanel: function () {
      this.expanded.pop();
      this.$store.dispatch('fetchItems', {
        model: this.model,
        filter: {},
      });
    },
    cancelEditPanel: function () {
      this.expanded.pop();
    },
    submitNewPanel: function () {
      this.newPanelExpanded = undefined;
      this.$store.dispatch('fetchItems', {
        model: this.model,
        filter: {},
      });
    },
    cancelNewPanel: function () {
      this.newPanelExpanded = undefined;
    },
    deleteItem: async function (props) {
      await this.$store.dispatch('deleteItem', {
        model: this.model,
        item: props.item,
      });
      await this.$store.dispatch('fetchItems', {
        model: this.model,
        filter: {},
      });
    },
    updateOptions: async function (options) {
      let filter;
      this.options = options;
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
          return `${e}  ${this.options.sortDesc[i] ? 'DESC' : 'ASC'}`;
        });
      }
      await this.fetchItems(filter);
      return;
    },
  },
  watch: {
    newPanelExpanded: function (newVal) {
      if (newVal === 0) this.$emit('inputFormExpanded');
    },
    accessToken: async function () {
      await this.fetchItems(this.$store.state[this.model].filter);
    },
  },
  data: function () {
    return {
      newPanelExpanded: undefined,
      currentExpanderView: 'modelEditor',
      options: {itemsPerPage: 5},
      loading: true,
      expanded: [],
      noDataText: NoDataText,
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

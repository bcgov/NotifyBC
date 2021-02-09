<template>
  <div>
    <v-text-field
      append-icon="search"
      hint='Enter free style text for full text search or LoopBack <i>where filter</i> compatible JSON string for parametrized search, for example {"channel": "email"}.'
      label="Search"
      single-line
      hide-details
      v-model="search"
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="$store.state[this.model].items"
      :single-expand="true"
      :expanded="expanded"
      class="elevation-1"
      :options.sync="options"
      :server-items-length="$store.state[this.model].totalCount"
      :loading="loading"
      :no-data-text="noDataText"
    >
      <template slot="item" slot-scope="props">
        <slot
          :props="props"
          :viewItem="viewItem"
          :editItem="editItem"
          :deleteItem="deleteItem"
        />
      </template>
      <template slot="expanded-item" slot-scope="props">
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
            <v-expansion-panel-header :hide-actions="true">
              <div class="text-center" color="indigo">
                <v-btn text icon>
                  <v-icon large color="indigo">{{
                    this.newPanelExpanded === 0 ? 'keyboard_arrow_up' : 'add'
                  }}</v-icon>
                </v-btn>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card>
                <v-card-text class="grey lighten-3">
                  <model-editor
                    class="ma-2"
                    @submit="submitNewPanel"
                    @cancel="cancelNewPanel"
                    :schema="schema"
                    :model="model"
                  />
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </v-data-table>
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
    fetchItems: async function(filter) {
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
    editItem: function(props) {
      let isExpanded = !props.isExpanded;
      if (this.currentExpanderView !== 'modelEditor' && !isExpanded) {
        isExpanded = !isExpanded;
      }
      this.currentExpanderView = 'modelEditor';
      props.expand(isExpanded);
      this.$emit('inputFormExpanded');
    },
    viewItem: function(props) {
      let isExpanded = !props.isExpanded;
      if (this.currentExpanderView !== 'modelViewer' && !isExpanded) {
        isExpanded = !isExpanded;
      }
      this.currentExpanderView = 'modelViewer';
      props.expand(isExpanded);
    },
    submitEditPanel: function() {
      this.expanded.pop();
      this.$store.dispatch('fetchItems', {
        model: this.model,
        filter: {},
      });
    },
    cancelEditPanel: function() {
      this.expanded.pop();
    },
    submitNewPanel: function() {
      this.newPanelExpanded = undefined;
      this.$store.dispatch('fetchItems', {
        model: this.model,
        filter: {},
      });
    },
    cancelNewPanel: function() {
      this.newPanelExpanded = undefined;
    },
    deleteItem: async function(props) {
      await this.$store.dispatch('deleteItem', {
        model: this.model,
        item: props.item,
      });
      await this.$store.dispatch('fetchItems', {
        model: this.model,
        filter: {},
      });
    },
  },
  watch: {
    options: {
      handler: async function() {
        let filter;
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
      deep: true,
    },
    newPanelExpanded: function(newVal) {
      if (newVal === 0) this.$emit('inputFormExpanded');
    },
    accessToken: async function() {
      await this.fetchItems(this.$store.state[this.model].filter);
    },
  },
  data: function() {
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

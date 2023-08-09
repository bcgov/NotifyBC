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
  <combo-table :headers="headers" :schema="schema" model="administrators">
    <template #default="props">
      <tr>
        <td>{{ props.props.item.columns.email }}</td>
        <td class="text-right">{{ props.props.item.columns.updated }}</td>
        <td>
          <v-btn
            @click="props.viewItem(props.props)"
            density="compact"
            variant="plain"
            icon="info"
          >
            <v-icon>info</v-icon>
            <v-tooltip activator="parent" location="bottom">details</v-tooltip>
          </v-btn>

          <v-btn
            @click="editAdmin(props)"
            density="compact"
            variant="plain"
            icon="create"
          >
            <v-icon>create</v-icon>
            <v-tooltip activator="parent" location="bottom">edit</v-tooltip>
          </v-btn>

          <v-btn
            @click="props.deleteItem(props.props)"
            density="compact"
            variant="plain"
            icon="delete"
          >
            <v-icon>delete</v-icon>
            <v-tooltip activator="parent" location="bottom">delete</v-tooltip>
          </v-btn>
        </td>
      </tr>
    </template>
    <template #newItem="props">
      <model-editor
        class="ma-2"
        @submit="props.submitNewPanel"
        @cancel="props.cancelNewPanel"
        :schema="newItemSchema"
        :model="props.model"
      />
    </template>
  </combo-table>
</template>

<script>
import ComboTable from './shared/combo-table';
import ModelEditor from './shared/editor';
import {merge} from 'lodash';
export default {
  components: {
    ComboTable,
    ModelEditor,
  },
  data: function () {
    const schema = {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          options: {
            hidden: true,
          },
        },
        email: {
          type: 'string',
          required: true,
          propertyOrder: 100,
        },
        password: {
          type: 'string',
          format: 'password',
          propertyOrder: 200,
          description:
            'leave blank to unchange; otherwise must meet documented complexity rules',
        },
        username: {
          type: 'string',
          propertyOrder: 300,
        },
        created: {
          type: 'string',
          options: {
            hidden: true,
          },
        },
        updated: {
          type: 'string',
          options: {
            hidden: true,
          },
        },
        createdBy: {
          type: 'string',
          options: {
            hidden: true,
          },
        },
        updatedBy: {
          type: 'string',
          options: {
            hidden: true,
          },
        },
      },
    };
    return {
      headers: [
        {
          title: 'email',
          align: 'left',
          key: 'email',
        },
        {
          title: 'updated',
          align: 'end',
          key: 'updated',
        },
        {
          title: 'actions',
          align: 'left',
          sortable: false,
        },
      ],
      schema,
      newItemSchema: merge({}, schema, {
        properties: {
          password: {
            description: 'must meet documented complexity rules',
            required: true,
          },
        },
      }),
    };
  },
  methods: {
    editAdmin: function (props) {
      try {
        props.props.item.raw.password = '';
      } catch (ex) {}
      props.editItem(props.props);
    },
  },
};
</script>

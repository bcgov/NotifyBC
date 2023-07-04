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
  <combo-table :headers="headers" :schema="schema" model="bounces">
    <template #default="props">
      <tr>
        <td>{{ props.props.item.columns.userChannelId }}</td>
        <td class="text-right">
          {{ props.props.item.columns.hardBounceCount }}
        </td>
        <td>{{ props.props.item.columns.state }}</td>
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
            @click="props.editItem(props.props)"
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
            icon="delete_forever"
          >
            <v-icon color="red darken-2">delete_forever</v-icon>
            <v-tooltip
              activator="parent"
              location="bottom"
              color="red darken-2"
            >
              Caution: delete immediately without confirmation
            </v-tooltip>
          </v-btn>
        </td>
      </tr>
    </template>
  </combo-table>
</template>

<script>
import ComboTable from './shared/combo-table';
export default {
  components: {
    ComboTable,
  },
  data: function () {
    return {
      headers: [
        {
          title: 'userChannelId',
          align: 'left',
          key: 'userChannelId',
        },
        {
          title: 'hardBounceCount',
          align: 'end',
          key: 'hardBounceCount',
        },
        {
          title: 'state',
          align: 'left',
          key: 'state',
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
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            options: {
              hidden: true,
            },
          },
          channel: {
            type: 'string',
            enum: ['email', 'sms'],
            propertyOrder: 50,
          },
          userChannelId: {
            type: 'string',
            propertyOrder: 100,
          },
          hardBounceCount: {
            type: 'integer',
            propertyOrder: 150,
          },
          state: {
            type: 'string',
            enum: ['active', 'deleted'],
            propertyOrder: 200,
          },
          bounceMessages: {
            type: 'array',
            format: 'tabs',
            items: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                  format: 'datetime',
                  description:
                    'use format yyyy-mm-ddThh:mm:ss.fffZ, ok to truncate minor parts. Examples 2017-10-23T17:53:44.502Z or 2017-10-23',
                },
                message: {
                  type: 'string',
                },
              },
            },
            propertyOrder: 200,
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
        },
      },
    };
  },
};
</script>

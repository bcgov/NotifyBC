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
        <td>{{ props.props.item.userChannelId }}</td>
        <td class="text-right">{{ props.props.item.hardBounceCount }}</td>
        <td>{{ props.props.item.state }}</td>
        <td class="text-right">{{ props.props.item.updated }}</td>
        <td>
          <v-tooltip bottom>
            <template v-slot:activator="{on}">
              <v-btn v-on="on" @click="props.viewItem(props.props)" text icon>
                <v-icon>info</v-icon>
              </v-btn>
              details
            </template></v-tooltip
          >
          <v-tooltip bottom>
            <template v-slot:activator="{on}">
              <v-btn v-on="on" @click="props.editItem(props.props)" text icon>
                <v-icon>create</v-icon>
              </v-btn>
            </template>
            edit
          </v-tooltip>
          <v-tooltip bottom color="red">
            <template v-slot:activator="{on}">
              <v-btn v-on="on" @click="props.deleteItem(props.props)" text icon>
                <v-icon color="red darken-2">delete_forever</v-icon>
              </v-btn>
            </template>
            Caution: delete immediately without confirmation
          </v-tooltip>
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
          text: 'userChannelId',
          align: 'left',
          value: 'userChannelId',
        },
        {
          text: 'hardBounceCount',
          align: 'end',
          value: 'hardBounceCount',
        },
        {
          text: 'state',
          align: 'left',
          value: 'state',
        },
        {
          text: 'updated',
          align: 'end',
          value: 'updated',
        },
        {
          text: 'actions',
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

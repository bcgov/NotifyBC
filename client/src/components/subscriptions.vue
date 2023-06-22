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
  <combo-table :headers="headers" :schema="schema" model="subscriptions">
    <template #default="props">
      <tr>
        <td>{{ props.props.item.columns.serviceName }}</td>
        <td>{{ props.props.item.columns.channel }}</td>
        <td>{{ props.props.item.columns.state }}</td>
        <td class="text-right">{{ props.props.item.columns.updated }}</td>
        <td>
          <v-tooltip bottom>
            <template v-slot:activator="{props}">
              <v-btn
                v-bind="props"
                @click="props.viewItem(props.props)"
                text
                icon
              >
                <v-icon>info</v-icon>
              </v-btn>
            </template>
            details
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{props}">
              <v-btn
                v-bind="props"
                @click="props.editItem(props.props)"
                text
                icon
              >
                <v-icon>create</v-icon>
              </v-btn>
            </template>
            edit
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
          title: 'serviceName',
          align: 'left',
          key: 'serviceName',
        },
        {
          title: 'channel',
          align: 'left',
          key: 'channel',
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
          serviceName: {
            type: 'string',
            propertyOrder: 100,
          },
          channel: {
            enum: ['email', 'sms'],
            type: 'string',
            propertyOrder: 200,
          },
          userId: {
            type: 'string',
            propertyOrder: 250,
          },
          userChannelId: {
            type: 'string',
            propertyOrder: 300,
          },
          state: {
            type: 'string',
            enum: ['unconfirmed', 'confirmed', 'deleted'],
            propertyOrder: 800,
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
      },
    };
  },
};
</script>

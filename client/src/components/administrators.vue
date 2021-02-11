<template>
  <combo-table :headers="headers" :schema="schema" model="administrators">
    <template #default="props">
      <tr>
        <td>{{ props.props.item.email }}</td>
        <td class="text-right">{{ props.props.item.updated }}</td>
        <td>
          <v-tooltip bottom>
            <template v-slot:activator="{on}">
              <v-btn v-on="on" @click="props.viewItem(props.props)" text icon>
                <v-icon>info</v-icon>
              </v-btn>
            </template>
            details
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{on}">
              <v-btn
                v-on="on"
                @click="
                  (props.props.item.password = ''), props.editItem(props.props)
                "
                text
                icon
              >
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
  data: function() {
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
          text: 'email',
          align: 'left',
          value: 'email',
        },
        {
          text: 'updated',
          align: 'right',
          value: 'updated',
        },
        {
          text: 'actions',
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
};
</script>

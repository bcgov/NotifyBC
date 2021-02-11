<template>
  <combo-table :headers="headers" :schema="schema" model="configurations">
    <template #default="props">
      <tr>
        <td>{{ props.props.item.name }}</td>
        <td>{{ props.props.item.serviceName }}</td>
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
          <template
            v-if="['dbSchemaVersion', 'rsa'].indexOf(props.props.item.name) < 0"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{on}">
                <v-btn v-on="on" @click="props.editItem(props.props)" text icon>
                  <v-icon>create</v-icon>
                </v-btn>
              </template>
              edit
            </v-tooltip>
          </template>
          <template
            v-if="['dbSchemaVersion', 'rsa'].indexOf(props.props.item.name) < 0"
          >
            <v-tooltip bottom color="red">
              <template v-slot:activator="{on}">
                <v-btn
                  v-on="on"
                  @click="props.deleteItem(props.props)"
                  text
                  icon
                >
                  <v-icon color="red darken-2">delete_forever</v-icon>
                </v-btn>
              </template>
              Caution: delete immediately without confirmation
            </v-tooltip>
          </template>
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
  data: function() {
    return {
      headers: [
        {
          text: 'name',
          align: 'left',
          value: 'name',
        },
        {
          text: 'serviceName',
          align: 'left',
          value: 'serviceName',
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
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            options: {
              hidden: true,
            },
          },
          name: {
            type: 'string',
            enum: ['notification', 'subscription'],
            propertyOrder: 100,
          },
          serviceName: {
            type: 'string',
            propertyOrder: 200,
          },
          value: {
            type: 'object',
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
      },
    };
  },
};
</script>

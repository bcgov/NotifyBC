<template>
  <combo-table
    id="nb-wc-notification-table"
    :headers="headers"
    :schema="schema"
    model="notifications"
    @inputFormExpanded="createAutoCompleteServiceNameWidget"
  >
    <template slot-scope="props">
      <tr>
        <td>{{ props.props.item.serviceName }}</td>
        <td>{{ props.props.item.channel }}</td>
        <td>{{ props.props.item.state }}</td>
        <td>{{ props.props.item.isBroadcast }}</td>
        <td class="text-right">{{ props.props.item.updated }}</td>
        <td>
          <v-btn @click="props.viewItem(props.props)" text icon>
            <v-icon>info</v-icon>
          </v-btn>
          <v-btn
            @click="props.editItem(props.props)"
            text
            icon
            v-if="props.props.item.state === 'new'"
          >
            <v-icon>create</v-icon>
          </v-btn>
        </td>
      </tr>
    </template>
  </combo-table>
</template>

<script>
import ComboTable from './shared/combo-table';
import 'jquery-ui-bundle';
import {mapActions} from 'vuex';
// one-time definition of custom jquery-ui widget
$.widget('custom.annotatedAutoComplete', $.ui.autocomplete, {
  _create: function() {
    this._super();
    this.widget().menu('option', 'items', '> :not(.disabled)');
  },
  _renderMenu: function(ul, items) {
    $('<li>')
      .attr('class', 'disabled')
      .append('matching services having confirmed subscribers:')
      .appendTo(ul);
    $.each(items, (i, e) => {
      this._renderItemData(ul, e);
    });
  },
});
export default {
  components: {
    ComboTable,
  },
  methods: {
    ...mapActions(['getSubscribedServiceNames']),
    createAutoCompleteServiceNameWidget: async function() {
      try {
        let items = await this.getSubscribedServiceNames();
        $(
          "#nb-wc-notification-table [name='root[serviceName]']",
        ).annotatedAutoComplete({
          appendTo: '#nb-wc-notification-table',
          source: items,
        });
        /*eslint no-empty: "off" */
      } catch (ex) {}
    },
  },
  data: function() {
    return {
      headers: [
        {
          text: 'serviceName',
          align: 'left',
          value: 'serviceName',
        },
        {
          text: 'channel',
          align: 'left',
          value: 'channel',
        },
        {
          text: 'state',
          align: 'left',
          value: 'state',
        },
        {
          text: 'isBroadcast',
          align: 'left',
          value: 'isBroadcast',
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
          serviceName: {
            type: 'string',
            propertyOrder: 100,
          },
          channel: {
            enum: ['email', 'sms', 'in-app'],
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
          isBroadcast: {
            type: 'boolean',
            propertyOrder: 400,
          },
          skipSubscriptionConfirmationCheck: {
            type: 'boolean',
            default: 'false',
            propertyOrder: 500,
          },
          asyncBroadcastPushNotification: {
            type: 'boolean',
            propertyOrder: 550,
            description:
              'set to true to avoid long processing time when sending broadcast notification to many subscribers',
          },
          validTill: {
            type: 'string',
            format: 'datetime',
            description:
              'use format yyyy-mm-ddThh:mm:ss.fffZ. Examples 2017-10-23T17:53:44.502Z',
            propertyOrder: 600,
          },
          invalidBefore: {
            type: 'string',
            format: 'datetime',
            description:
              'use format yyyy-mm-ddThh:mm:ss.fffZ. Examples 2017-10-23T17:53:44.502Z',
            propertyOrder: 700,
          },
          state: {
            type: 'string',
            enum: ['new', 'sending', 'sent', 'read', 'error', 'deleted'],
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
          httpHost: {
            type: 'string',
            options: {
              hidden: true,
            },
          },
          message: {
            description: 'sub-fields depend on channel',
            propertyOrder: 900,
            oneOf: [
              {
                title: 'email',
                type: 'object',
                properties: {
                  from: {
                    type: 'string',
                  },
                  subject: {
                    type: 'string',
                  },
                  textBody: {
                    type: 'string',
                    format: 'html',
                  },
                  htmlBody: {
                    type: 'string',
                    format: 'html',
                    options: {
                      wysiwyg: 'summernote',
                    },
                  },
                },
              },
              {
                title: 'sms',
                type: 'object',
                properties: {
                  textBody: {
                    type: 'string',
                    format: 'html',
                  },
                },
              },
              {
                title: 'in-app',
                type: 'object',
              },
            ],
          },
        },
      },
    };
  },
};
</script>

<style lang="less">
#nb-wc-notification-table {
  @import (less) '~jquery-ui-bundle/jquery-ui.css';
  .disabled {
    pointer-events: none; //This makes it not clickable
    opacity: 0.6; //This grays it out to look disabled
  }
}
</style>
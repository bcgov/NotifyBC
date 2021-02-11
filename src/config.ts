module.exports = {
  restApiRoot: '/api',
  // host ip address NotifyBC listen on
  host: '0.0.0.0',
  // port listen on
  port: 3000,
  remoting: {
    rest: {
      normalizeHttpPath: false,
      xml: false,
      handleErrors: false,
    },
    json: {
      strict: false,
      limit: '100kb',
    },
    urlencoded: {
      extended: true,
      limit: '100kb',
    },
    cors: false,
  },
  legacyExplorer: false,
  adminIps: ['127.0.0.1'],
  siteMinderReverseProxyIps: ['127.0.0.1'],
  defaultSmtp: {
    direct: true,
    name: 'localhost',
  },
  smsServiceProvider: 'twilio',
  sms: {
    swift: {
      apiUrlPrefix: 'https://secure.smsgateway.ca/services/message.svc/',
    },
  },
  subscription: {
    detectDuplicatedSubscription: false,
    duplicatedSubscriptionNotification: {
      sms: {
        textBody:
          'A duplicated subscription was submitted and rejected. You will continue receiving notifications. If the request was not created by you, pls ignore this msg.',
      },
      email: {
        from: 'no_reply@invalid.local',
        subject: 'Duplicated Subscription',
        textBody:
          'A duplicated subscription was submitted and rejected. You will continue receiving notifications. If the request was not created by you, please ignore this message.',
      },
    },
    confirmationRequest: {
      sms: {
        confirmationCodeRegex: '\\d{5}',
        sendRequest: true,
        textBody: 'Enter {confirmation_code} on screen',
      },
      email: {
        confirmationCodeRegex: '\\d{5}',
        sendRequest: true,
        from: 'no_reply@invalid.local',
        subject: 'Subscription confirmation',
        textBody: 'Enter {subscription_confirmation_code} on screen',
      },
    },
    confirmationAcknowledgements: {
      successMessage: 'You have been subscribed.',
      failureMessage: 'Error happened while confirming subscription.',
    },
    anonymousUnsubscription: {
      code: {
        required: true,
        regex: '\\d{5}',
      },
      acknowledgements: {
        onScreen: {
          successMessage: 'You have been un-subscribed.',
          failureMessage: 'Error happened while un-subscribing.',
        },
        notification: {
          email: {
            from: 'no_reply@invalid.local',
            subject: 'Un-subscription acknowledgement',
            textBody:
              'This is to acknowledge you have been un-subscribed from receiving notification for {unsubscription_service_names}. If you did not authorize this change or if you changed your mind, open {unsubscription_reversion_url} to revert.',
            htmlBody:
              'This is to acknowledge you have been un-subscribed from receiving notification for {unsubscription_service_names}. If you did not authorize this change or if you changed your mind, click <a href="{unsubscription_reversion_url}">here</a> to revert.',
          },
        },
      },
    },
    anonymousUndoUnsubscription: {
      successMessage: 'You have been re-subscribed.',
      failureMessage: 'Error happened while re-subscribing.',
    },
  },
  notification: {
    handleListUnsubscribeByEmail: true,
    handleBounce: true,
    broadcastSubscriberChunkSize: 1000,
    broadcastSubRequestBatchSize: 10,
    logSuccessfulBroadcastDispatches: false,
  },
  cron: {
    purgeData: {
      timeSpec: '0 0 1 * * *',
      pushNotificationRetentionDays: 30,
      expiredInAppNotificationRetentionDays: 30,
      nonConfirmedSubscriptionRetentionDays: 30,
      deletedBounceRetentionDays: 30,
      expiredAccessTokenRetentionDays: 30,
      defaultRetentionDays: 30,
    },
    dispatchLiveNotifications: {
      timeSpec: '0 * * * * *',
    },
    checkRssConfigUpdates: {
      timeSpec: '0 * * * * *',
    },
    deleteBounces: {
      timeSpec: '0 0 * * * *',
      minLapsedHoursSinceLatestNotificationEnded: 1,
    },
  },
  inboundSmtpServer: {
    enabled: true,
    bounce: {
      unsubThreshold: 5,
      subjectRegex: '',
      smtpStatusCodeRegex: '5\\.\\d{1,3}\\.\\d{1,3}',
      failedRecipientRegex:
        '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])',
    },
  },
};

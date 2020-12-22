import {
  Application,
  ApplicationConfig,
  CoreBindings,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('g8')
export class CronObserver implements LifeCycleObserver {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    @inject(CoreBindings.APPLICATION_CONFIG)
    private appConfig: ApplicationConfig,
  ) {}

  /**
   * This method will be invoked when the application starts.
   */
  async start(): Promise<void> {
    // Add your logic for start
    if (process.env.NOTIFYBC_NODE_ROLE === 'slave') {
      return;
    }
    var CronJob = require('cron').CronJob;
    var cronTasks = require('./cron-tasks');
    var cronConfig = this.appConfig.cron || {};
    // start purgeData cron
    var cronConfigPurgeData = cronConfig.purgeData || {};
    new CronJob({
      cronTime: cronConfigPurgeData.timeSpec,
      onTick: () => {
        cronTasks.purgeData(this.app, this.appConfig);
      },
      start: true,
    });
    // start dispatchLiveNotifications cron
    var cronConfigDispatchLiveNotifications =
      cronConfig.dispatchLiveNotifications || {};
    new CronJob({
      cronTime: cronConfigDispatchLiveNotifications.timeSpec,
      onTick: () => {
        cronTasks.dispatchLiveNotifications(this.app, this.appConfig);
      },
      start: true,
    });
    // start checkRssConfigUpdates cron
    var cronConfigCheckRssConfigUpdates =
      cronConfig.checkRssConfigUpdates || {};
    new CronJob({
      cronTime: cronConfigCheckRssConfigUpdates.timeSpec,
      onTick: () => {
        cronTasks.checkRssConfigUpdates(this.app, this.appConfig);
      },
      start: true,
    });
    // start deleteBounces cron
    let deleteBounces = cronConfig.deleteBounces || {};
    new CronJob({
      cronTime: deleteBounces.timeSpec,
      onTick: () => {
        cronTasks.deleteBounces(this.app, this.appConfig);
      },
      start: true,
    });
  }
}

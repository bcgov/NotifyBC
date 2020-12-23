import {
  Application,
  CoreBindings,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';
import {AnyObject} from '@loopback/repository';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('g8')
export class CronObserver implements LifeCycleObserver {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    private jobs: any[] = [],
  ) {}

  /**
   * This method will be invoked when the application starts.
   */
  async start(): Promise<void> {
    // Add your logic for start
    if (process.env.NOTIFYBC_NODE_ROLE === 'slave') {
      return;
    }
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    const CronJob = require('cron').CronJob;
    const cronTasks = require('./cron-tasks');
    const cronConfig: AnyObject =
      (await this.app.getConfig(CoreBindings.APPLICATION_INSTANCE, 'cron')) ??
      {};
    // start purgeData cron
    const cronConfigPurgeData = cronConfig.purgeData || {};
    this.jobs.push(
      new CronJob({
        cronTime: cronConfigPurgeData.timeSpec,
        onTick: await cronTasks.purgeData(this.app),
        start: true,
      }),
    );
    // start dispatchLiveNotifications cron
    const cronConfigDispatchLiveNotifications =
      cronConfig.dispatchLiveNotifications || {};
    this.jobs.push(
      new CronJob({
        cronTime: cronConfigDispatchLiveNotifications.timeSpec,
        onTick: await cronTasks.dispatchLiveNotifications(this.app),
        start: true,
      }),
    );
    // start checkRssConfigUpdates cron
    const cronConfigCheckRssConfigUpdates =
      cronConfig.checkRssConfigUpdates || {};
    this.jobs.push(
      new CronJob({
        cronTime: cronConfigCheckRssConfigUpdates.timeSpec,
        onTick: await cronTasks.checkRssConfigUpdates(this.app),
        start: true,
      }),
    );
    // start deleteBounces cron
    const deleteBounces = cronConfig.deleteBounces || {};
    this.jobs.push(
      new CronJob({
        cronTime: deleteBounces.timeSpec,
        onTick: await cronTasks.deleteBounces(this.app),
        start: true,
      }),
    );
  }
  async stop(): Promise<void> {
    for (const job of this.jobs) {
      job.stop();
    }
  }
}
